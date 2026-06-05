import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, await params);
}

async function handleProxy(request: NextRequest, { path }: { path: string[] }) {
  let apiPath = path.join('/');
  
  // Évite la duplication de /api/ si le client envoie déjà le préfixe
  if (apiPath.startsWith('api/')) {
    apiPath = apiPath.substring(4);
  } else if (apiPath === 'api') {
    apiPath = '';
  }
  
  const searchParams = request.nextUrl.searchParams.toString();
  const apiBaseUrl = process.env.API_URL || 'http://api:8080';
  const backendUrl = `${apiBaseUrl}/api/${apiPath}${searchParams ? '?' + searchParams : ''}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (key !== 'host' && key !== 'connection') {
      headers.set(key, value);
    }
  });

  const method = request.method;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  
  let body: string | undefined = undefined;
  if (hasBody) {
    try {
      body = await request.text();
    } catch (e) {
      // Corps absent ou illisible
    }
  }

  try {
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await response.text();
    
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', response.headers.get('Content-Type') || 'application/json');

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('API Proxy error:', error);
    return NextResponse.json(
      {
        status: 500,
        message: `Erreur de connexion avec le serveur API (${backendUrl})`,
        timestamp: new Date().toISOString(),
        errors: [error.message],
      },
      { status: 500 }
    );
  }
}
