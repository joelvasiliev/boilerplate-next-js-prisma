import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(){
    try {
        const response = await fetch(`${process.env.BOX_LINK_PRODUCTS_ENDPOINT}`, {
          method: 'GET',
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
    
        const parseDate = (dateString: string) => {
          const [datePart, timePart] = dateString.split(' ');
          const [day, month, year] = datePart.split('/').map(Number);
          const [hours, minutes, seconds] = timePart.split(':').map(Number);
          return new Date(year, month - 1, day, hours, minutes, seconds);
        };
    
        const referenceDate = parseDate("26/12/2024 23:57:45");
        const endDate = parseDate("27/12/2024 12:21:51");
    
        const recentEvents = data.filter(event => {
          const eventDate = parseDate(event.created_at);
          return eventDate >= referenceDate && eventDate <= endDate;
        });

        const res = []
        for(const event of recentEvents){
          const sale = await prisma.sales.findFirst({
            where: {
              content: event.Conteudo,
            },
            include: {
              delivery: true,
              customer: true,
              ProductSale: {
                include: {
                  product: true,
                }
              }
            }
          })

          if(!sale.approved) {
            console.log('Venda ainda não aprovada, pulando...')
            continue
          }
          const input = {
            "Nome": sale.customer.name,
            "CPF": sale.customer.cpf?.replace(/[^0-9]/g, "") || "",
            "Email": sale.customer.email || "",
            "Celular": sale.customer.phone?.replace(/[^0-9]/g, "") || "",
            "Rua": sale.delivery.address || "",
            "Numero": sale.delivery.address_number || "",
            "Complemento": sale.delivery.complement || "",
            "Bairro": sale.delivery.neighborhood?.replace(/[^a-zA-Z\s]/g, '') || "",
            "Cidade": sale.delivery.city?.replace(/[^a-zA-Z\s]/g, '') || "",
            "Uf": sale.delivery.state_code?.replace(/[^a-zA-Z\s]/g, '') || "",
            "CEP": sale.delivery.cep?.replace(/[^0-9]/g, "") || "",
            "Conteudo": sale.annotation,
            "Valor": `${sale.ProductSale[0].invoicing}` || ""
          }
          // res.push(event)

          const boxlink_delete_res = await fetch(process.env.V2_BOX_LINK_POST_PRODUCT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(input)
          })
          const data_boxlink_delete_res = await boxlink_delete_res.json();

          res.push({
            ...data_boxlink_delete_res,
            cod: event.Conteudo,
          })
        }

        return NextResponse.json({
            count: res.length,
            data: res,
        })
      } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({
            message: error.message
        }, {status: 500})
      }  
}