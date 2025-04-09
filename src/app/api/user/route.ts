import {prisma} from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function GET(){
    const users = await prisma.user.findMany();

    const usersWithoutPassword = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    return NextResponse.json(usersWithoutPassword);
}

export async function POST(req: Request){
    const body = await req.json();
    const {email, password, role} = body;
    const existingUser = await prisma.user.findFirst({
        where: { email },
      });
  
    if (existingUser) {
    return NextResponse.json({ error: "Usuário já registrado" }, {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            godfather_id: body.godfather_id ? body.godfather_id : null
        },
    });

    return NextResponse.json({ message: "Usuário criado com sucesso!", user }, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erro ao criar o usuário" }, {status: 500});
    }
}

export async function DELETE(req: Request) {
    const {user_id} = await req.json();

    await prisma.user.delete({
        where: {
            id: user_id
        }
    })

    return NextResponse.json({message: 'Usuário deletado com sucesso'}, {status: 200})
}
