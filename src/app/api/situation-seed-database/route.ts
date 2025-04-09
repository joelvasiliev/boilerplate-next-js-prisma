import { DeliveryEventsStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma";
import { getEventSituations } from "@/actions/get-event-situations";

export async function POST(){
    const new_data = [];

    const situacoes = await getEventSituations();

    for(const s of situacoes){
        const new_situation = await prisma.deliveryEventsSituation.create({
            data: {
                color: s.color,
                descricao: s.descricao,
                id: s.id,
                fontColor: s.fontColor,
                situacao: s.situacao,
                tipo: s.tipo as DeliveryEventsStatus,
            }
        })

        new_data.push(new_situation)
    }

    return NextResponse.json(new_data, {status: 201})
}