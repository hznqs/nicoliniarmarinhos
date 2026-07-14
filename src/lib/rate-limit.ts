// Rate limit in-memory para proteção básica contra brute-force
// Em um cenário real com Vercel ou Múltiplas Instâncias, deve-se usar Redis (ex: Upstash)

type RateLimitInfo = {
  count: number
  lastAttempt: number
}

const rateLimitMap = new Map<string, RateLimitInfo>()

const DEFAULT_MAX_ATTEMPTS = 5
const DEFAULT_LOCKOUT_MS = 15 * 60 * 1000 // 15 minutos

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = DEFAULT_MAX_ATTEMPTS,
  lockoutMs: number = DEFAULT_LOCKOUT_MS
): { success: boolean; remaining: number } {
  const now = Date.now()
  const info = rateLimitMap.get(identifier)

  if (!info) {
    rateLimitMap.set(identifier, { count: 1, lastAttempt: now })
    return { success: true, remaining: maxAttempts - 1 }
  }

  // Se passou o tempo de bloqueio, reseta
  if (now - info.lastAttempt > lockoutMs) {
    rateLimitMap.set(identifier, { count: 1, lastAttempt: now })
    return { success: true, remaining: maxAttempts - 1 }
  }

  // Incrementa a tentativa
  info.count += 1
  info.lastAttempt = now
  rateLimitMap.set(identifier, info)

  if (info.count > maxAttempts) {
    return { success: false, remaining: 0 }
  }

  return { success: true, remaining: maxAttempts - info.count }
}

export function resetRateLimit(identifier: string) {
  rateLimitMap.delete(identifier)
}
