import { getDeliveryEventSituationBySituationId } from "@/actions/get-delivery-event-situation-by-id";
import { getSaleByContent } from "@/actions/get-sale-by-id";
import { updateSales } from "@/actions/update-sale";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getBoxLinkSales } from "@/actions/boxlink-get-sales";

async function parseDeliveryStatusToId(status: string){
    switch(status){
        case "Aguardando Retirada":
            return 15;
        case "Saiu para Entrega":
            return 3;
        case "Objeto entregue ao destinatário":
            return 4;
        case "Retornando ao Remetente":
            return 23;
        case "Objeto Postado":
            return 1;
        case "Objeto com problemas na entrega":
            return 6;
        case "Em transporte":
            return 8;
        case "Em transito Correios":
            return 8;
        case "Envio Cancelado":
            return 19;
        case "Cancelamento Solicitado":
            return 18;
        case "Entregue":
            return 4;
        case "Aguardando":
            return 30;
    }
}

export async function POST(req: Request){
    try{
        console.log('webhook recebido')
        const body = await req.json();
        await fetch(`https://adamant-memory-57.webhook.cool`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const sales = await getBoxLinkSales();
        const has_result = sales.find((obj: any) => obj.Conteudo === body.cod);

        if(!has_result) throw new Error('Produto não encontrado')

        let sale = await getSaleByContent(has_result.Conteudo)
        if(!sale) throw new Error('Venda não encontrada');

        await updateSales({
            content: has_result.Conteudo,
            invoice: has_result.Nota_fiscal,
            delivery_type: has_result.Servico
        })

        const situation_id = await parseDeliveryStatusToId(body.Status);
        if(!situation_id) throw new Error('Situation ID não encontrado');
        const delivery_status = await getDeliveryEventSituationBySituationId(situation_id);
        if(!delivery_status) throw new Error('Delivery Status não encontrado');;
        const boxlink_data = await fetch(`${process.env.BOX_LINK_API_URL}${has_result.Codrastreamento||""}`)
        const parsed_boxlink_data = await boxlink_data.json();

        console.log('s')
        console.log(situation_id)
        console.log(delivery_status)

        if(!sale.delivery.id){
            console.log('ainda n existe um delivery, criando...')
            await prisma.delivery.create({
                data: {
                    address: has_result.Endereco,
                    address_number: has_result.Numero,
                    cep: has_result.Cep,
                    city: has_result.Cidade,
                    complement: has_result.Complemento,
                    neighborhood: has_result.Bairro,
                    state_code: has_result.Uf,
                    sales_id: has_result.id,
                    }
                })
        }  

        const last_delivery_event = sale.delivery.deliveryevents[0]

        if(last_delivery_event.delivery_event_situation_id === delivery_status.id) {

            await prisma.deliveryEvents.update({
                where: {
                    id: last_delivery_event.id
                },
                data: {
                    tracking_code: parsed_boxlink_data.data.rastreadorTransportadora || parsed_boxlink_data.data.rastreadorTms
                }
            })

            return NextResponse.json({
                message: "Último evento tem o mesmo ID do webhook enviado."
            }, {status: 200})
        }

        const new_delivery_event = await prisma.deliveryEvents.create({
            data: {
                delivery_id: sale.delivery.id,
                delivery_event_situation_id: delivery_status.id,
                sales_id: `${has_result.id}`,
                date: new Date(Date.now()),
                description: body.Status,
                origin: "API",
                status: delivery_status.tipo,
                tracking_code: parsed_boxlink_data.data.rastreadorTransportadora || parsed_boxlink_data.data.rastreadorTms,
            }
        })

        return NextResponse.json({
            data: {...new_delivery_event}
        }, {status: 201})
    }
    catch(e){
        console.error(e)
        return NextResponse.json({
            message: e.message
        }, {status: 400})
    }
}