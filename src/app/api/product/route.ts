import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(){
    const customers = await prisma.product.findMany({
        include: {
            ProductPrice: true,
        }
    });
    return NextResponse.json(customers);
}