import { NextRequest, NextResponse } from 'next/server';

type Props = {
  params: Promise<{ path: string[] }>;
};

export async function GET(request: NextRequest, { params }: Props) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function POST(request: NextRequest, { params }: Props) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function PUT(request: NextRequest, { params }: Props) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { path } = await params;
  return handleRequest(request, path);
}

export async function PATCH(request: NextRequest, { params }: Props) {
  const { path } = await params;
  return handleRequest(request, path);
}

async function handleRequest(request: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  
  // Use environment variable for flexibility between local and production
  const backendBaseUrl = process.env.BACKEND_API_URL || 'https://contacts-management-system-backend.vercel.app/api';
  const url = `${backendBaseUrl}/${path}${searchParams ? `?${searchParams}` : ''}`;

  const headers = new Headers(request.headers);
  headers.delete('host'); 

  try {
    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer();

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const responseData = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);
    
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');

    if (response.status >= 400 && process.env.NODE_ENV !== 'production') {
      try {
        const text = new TextDecoder().decode(responseData);
        console.error(`Backend returned ${response.status}:`, text);
      } catch (e) {
        console.error(`Backend returned ${response.status} (could not decode body)`);
      }
    }

    return new NextResponse(responseData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Proxy error:', error);
    }
    return NextResponse.json({ 
      error: 'Proxy error', 
      details: process.env.NODE_ENV !== 'production' ? (error instanceof Error ? error.message : String(error)) : undefined 
    }, { status: 500 });
  }
}
