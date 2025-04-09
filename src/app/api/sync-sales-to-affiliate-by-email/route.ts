import { syncSalesToAfiliateByEmail } from '@/actions/sync-sales-to-afiliate-by-email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try{
        const body = await req.json();

        const data = await syncSalesToAfiliateByEmail(body.affiliate_id, body.email);

        return NextResponse.json({ data }, { status: 201 });

    }catch(e){
        return NextResponse.json({ message: e }, { status: 500 });
    }

}
