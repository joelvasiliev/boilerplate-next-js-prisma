import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(req: Request){
    const res = await fetch(`${process.env.BOX_LINK_ESTOQUE_ENDPOINT}`, {
        method: 'GET'
    })
    const products_data = await res.json();

    for (const product of products_data ) {
        const already_has_product = await prisma.product.findFirst({
            where: {
                name: product.Produto
            }
        })

        if(!already_has_product) {
            console.log(`Produto ${product.Produto} criado com sucesso`)
            await prisma.product.create({
                data: {
                    name: product.Produto,
                }
            })
        }
    }


    return NextResponse.json({});
}