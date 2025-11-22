import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API route for Coinbase authentication
 * This route acts as a CORS proxy between the client and Coinbase servers
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, method = 'POST', data } = body;

    // Validate endpoint to prevent unauthorized requests
    const allowedEndpoints = [
      'https://api.coinbase.com/v1/oauth2/token',
      'https://api.coinbase.com/v1/user',
    ];

    if (!allowedEndpoints.some(url => endpoint?.includes(url))) {
      return NextResponse.json(
        { error: 'Unauthorized endpoint' },
        { status: 403 }
      );
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();

    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint parameter' },
        { status: 400 }
      );
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
