import { getDeliveryEventSituationBySituationId } from '@/actions/get-delivery-event-situation-by-id';
import {prisma} from '@/lib/prisma';
import { Delivery, DeliveryEvents, Sales } from '@prisma/client';
import { NextResponse } from 'next/server';

function parseDate(dateString: string) {
    if (!isNaN(Date.parse(dateString))) {
        return new Date(dateString).toISOString();
    }

    const [day, month, yearAndTime] = dateString.split('/');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes, seconds] = time.split(':');

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds)
    );

    return date.toISOString();
}


type DeliveryWithEvents = Delivery & {
deliveryevents?: DeliveryEvents[];
};

type SalesWithProps = Sales & {
delivery: DeliveryWithEvents;
};

async function fetchCorreios(delivery_id: string, db_sale: SalesWithProps, tracking_code: string){
    const response = await fetch(`${process.env.BOX_LINK_API_URL}${tracking_code}`, {
        method: 'GET',
    });
    const {data} = await response.json();
    if(!data || !data.eventos) return;
    if(!db_sale) return;
    

    for ( const evento of data.eventos) {
        if(data.rastreadorTms === "GLD950016600E"){
            console.log('GLD950016600E')
            console.log(evento);
        }
        // if(!db_sale.delivery.deliveryevents || db_sale.delivery.deliveryevents.length === 0){
            const delivery_status = await getDeliveryEventSituationBySituationId(evento.situacaoId)

            if(!delivery_status) throw new Error("Erro ao definir status do evento");
            console.log('Criando novo deliveryEvent')

            const last_delivery_event = await prisma.deliveryEvents.findFirst({
                where: {
                    delivery_id,
                    sales_id: db_sale.id.toString(),
                },
                orderBy: {
                    date: 'desc'
                }
            })

            if(last_delivery_event.delivery_event_situation_id === delivery_status.id) {
                console.log('O último evento tem o mesmo ID de evento, pulando...')
                 await prisma.deliveryEvents.update({
                    where: {
                        id: last_delivery_event.id,
                    },
                    data: {
                        tracking_code: evento.tipo === 'CORREIO' ? evento.rastreadorTransportadora : evento.rastreadorTms
                    },
                })
                return;
            }

            await prisma.deliveryEvents.create({
                data: {
                    sales_id: db_sale.id.toString(),
                    delivery_id: delivery_id,
                    date: `${parseDate(evento.dataEvento)}`,
                    description: `${evento.descricao}`,
                    origin: 'API',
                    delivery_event_situation_id: delivery_status.id,
                    status: delivery_status.tipo,
                    tracking_code: evento.tipo === "CORREIO" ? evento.rastreadorTransportadora : evento.rastreadorTms,
                }
            })
    }
}

export async function POST(){
    console.log('Delivery Update called')
    try{

    const response = await fetch(`${process.env.BOX_LINK_PRODUCTS_ENDPOINT}`, {
        method: 'GET',
    });
    const data = await response.json();

    if(!data) throw new Error("Sistema Box Link fora do ar");

    for (const product of data ) {
        let db_sale: SalesWithProps = await prisma.sales.findFirst({
            where: {
                OR: [
                    {content: product.Conteudo},
                    {id: Number(product.id)},
                ]
            },
            include: {
                delivery: {
                    include: {
                        deliveryevents: true
                    }
                }
            }
        })
        // console.log(product.id)
        // console.log(product.Conteudo)
        // console.log(db_sale)

        if(!db_sale) continue;

        let {delivery} = db_sale;

        if(!delivery) {
            delivery = await prisma.delivery.create({
                data: {
                    sales_id: Number(product.id),
                    cep: product.Cep,
                    city: product.Cidade,
                    neighborhood: product.Bairro,
                    state_code: product.Uf,
                    complement: product.Complemento,
                    address_number: product.Numero,
                    address: product.Endereco,
                },
            })

            db_sale = await prisma.sales.findFirst({
                where: {
                    id: Number(product.id),
                },
                include: {
                    delivery: {
                        include: {
                            deliveryevents: true
                        }
                    }
                }
            })
        }

        if(!db_sale.delivery.deliveryevents || db_sale.delivery.deliveryevents.length === 0) {
            await prisma.deliveryEvents.create({
                data: {
                    sales_id: `${product.id}`,
                    delivery_id: delivery.id,
                    date: `${parseDate(product.created_at)}`,
                    description: "Aguardando transportadora",
                    origin: "TMS",
                    delivery_event_situation_id: 30,
                    status: "AGUARDANDO_OBJETO_AGENCIA",
                    tracking_code: product.Codrastreamento,
                }
            })
        }

        if(product.Codrastreamento !== "") {
            await fetchCorreios(delivery.id, db_sale, product.Codrastreamento);
        }
    }

    return NextResponse.json({});
    }
    catch(e: any) {
        console.error(e.message);
        return NextResponse.json({}, {status: 500});
    }
}