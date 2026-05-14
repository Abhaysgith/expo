import { NextResponse } from 'next/server';

export function ok<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    message: message ?? 'OK',
  });
}

export function err(error: string, status = 400) {
  return NextResponse.json({ success: false, error, data: null }, { status });
}
