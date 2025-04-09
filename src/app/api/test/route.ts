import { findSimilarProposals } from '@/actions/find-similar-proposals';
import { NextResponse } from 'next/server';

export async function POST() {

    const data = await findSimilarProposals();

    return NextResponse.json([...data], { status: 200 });
}
