import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function PUT(req: Request) {
    try {
    const {id, role} = await req.json();
    const existingUser = await prisma.user.findFirst({
        where: { id },
      });

    if (!existingUser) {
    return NextResponse.json({ error: "Usuário não encontrado" }, {status: 400});
    }

    await prisma.user.update({
        where: {
            id
        },
        data: {
            role
        }
    })

    return NextResponse.json({message: 'Usuário atualizado com sucesso'}, {status: 201})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao atualizar o usuário" }, {status: 500});
        }
}