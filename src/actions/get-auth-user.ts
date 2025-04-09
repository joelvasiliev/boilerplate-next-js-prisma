'use server';

import { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export interface AuthUser extends User {
}

export async function getAuthUser(): Promise<{ message: string, data?: AuthUser }> {
    try {
        const session = await getServerSession();

        if (!session) throw new Error('Sessão não encontrada');

        const email = session.user?.email;
        if (!email) throw new Error('Email não encontrado');

        const user = await prisma.user.findUnique({
            where: { email },
        }) as AuthUser;

        if (!user) throw new Error('Usuário não encontrado');

        return {
            message: 'Usuário encontrado',
            data: user
        };
    } catch (err) {
        return {
            message: err as any
        };
    }
}