import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${API_URL}/reports/${id}/download`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!backendResponse.ok) {
            return NextResponse.json(
                { error: 'Failed to download report' },
                { status: backendResponse.status },
            );
        }

        const pdfBuffer = await backendResponse.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="pragya_report_${id}.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        );
    }
}
