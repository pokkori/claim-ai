import { NextRequest, NextResponse } from 'next/server';

// Upstash Redisが設定されていない場合はインメモリフォールバック
const memoryStore = new Map<string, { count: number; resetAt: number }>();

export async function rateLimit(
  req: NextRequest,
  options = { requests: 10, window: 60 } // 1分10回
): Promise<NextResponse | null> {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const now = Date.now();
  const key = `rl:${ip}`;

  // Upstash Redisがある場合
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(options.requests, `${options.window} s`),
      });
      const { success } = await ratelimit.limit(key);
      if (!success) {
        return NextResponse.json(
          { error: 'リクエスト数が制限を超えました。しばらく後にお試しください。' },
          { status: 429, headers: { 'Retry-After': String(options.window) } }
        );
      }
      return null;
    } catch {
      // Upstash失敗時はインメモリフォールバックへ
    }
  }

  // インメモリフォールバック
  const entry = memoryStore.get(key);
  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + options.window * 1000 });
    return null;
  }
  entry.count++;
  if (entry.count > options.requests) {
    return NextResponse.json(
      { error: 'リクエスト数が制限を超えました。しばらく後にお試しください。' },
      { status: 429, headers: { 'Retry-After': String(options.window) } }
    );
  }
  return null;
}
