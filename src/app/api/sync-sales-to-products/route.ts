import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST() {
    const sales = await prisma.sales.findMany({});

    const sales_sync = [];
    for (const sale of sales) {
        const annotation = sale.annotation;
        const formattedMsg = annotation.replace(/\s+/g, '').toLowerCase();

        const splitted_formatted_msg = formattedMsg.split("x");
        const amount = parseInt(splitted_formatted_msg[0], 10);
        let product_name = splitted_formatted_msg[1];

        if (product_name === "glicostop" || product_name === "glicostop3meses" || product_name === "50frascosglicostop" || product_name === "glicostop5meses") {
            product_name = "glico stop";
        }

        if (product_name !== "glico stop") continue;

        const product = await prisma.product.findFirst({
            where: {
                name: { contains: product_name.toUpperCase() },
            },
            include: {
                ProductPrice: true,
            },
        });

        if (!product) continue;

        const already_exists = await prisma.productSale.findFirst({
            where: {
                product_id: product.id,
                sale_id: sale.id,
            }
        });

        if(already_exists) continue;

        const productPrice = product.ProductPrice.find(price => price.min === amount);

        if (!productPrice) {
            continue
        }

        const profit = productPrice.price - productPrice.cost;


        await prisma.productSale.create({
            data: {
                amount,
                invoicing: productPrice.price,
                profit,
                sale_id: sale.id,
                product_id: product.id,
                createdAt: sale.created_at
            }
        })

        sales_sync.push({
            id: uuidv4(),
            amount: amount,
            name: product_name,
            profit,
            cost: productPrice.cost,
            price: productPrice.price,
        });
    }

    return NextResponse.json({ changed: sales_sync.length, sales_sync }, { status: 201 });
}
