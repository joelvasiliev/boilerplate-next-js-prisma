import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function POST(){
    console.log('Initial seed database called')
    const response = await fetch(`${process.env.BOX_LINK_PRODUCTS_ENDPOINT}`, {
        method: 'GET',
    });
    const data = await response.json();
    const created_sales = [];
    for (const sale of data) {
        let customer = await prisma.customer.findFirst({
            where: {
                cpf: sale.Cpf.replace(/\D/g, '') 
            }
        })
        if(!customer) {
            customer = await prisma.customer.create({
                data: {
                    email: sale.Email,
                    name: sale.Nome,
                    cpf: sale.Cpf.replace(/\D/g, ''),
                    phone: sale.Celular,
                }
            })
        }
        const parseDate = (datestring: string) => {
            let formated_date = `${datestring.replaceAll("/", "-").replace(" ", "T")}.000Z`;

            const [datePart, timePart] = formated_date.split('T');
            const [day, month, year] = datePart.split('-');

            const isoString = `${year}-${month}-${day}T${timePart}`;

            return new Date(isoString).toISOString();
        }

        const saleExists = await prisma.sales.findFirst({
            where: {
                OR: [
                    {id: sale.id},
                    {content: sale.Conteudo}
                ]
            },
        });
    
        if (saleExists) {
            continue;
        }
        console.log(sale.Conteudo)
        const new_sale = await prisma.sales.create({
            data: {
                id: sale.id,
                user_id: null,
                approved: null,
                annotation: sale.Observacoes || null,
                content: sale.Conteudo || null,
                delivery_type: sale.Servico || "API",
                invoice: sale.Nota_fiscal || null,
                created_at: `${parseDate(sale.created_at)}`,
                customer_id: customer.id,
            }
        });

        created_sales.push(new_sale)
    }
    
    return NextResponse.json({
        status: 201,
        data: created_sales
    });
}