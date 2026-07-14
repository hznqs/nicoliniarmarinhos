import { describe, it, expect, vi, beforeEach } from 'vitest'
import { requireAdmin } from '@/lib/auth-guard'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

// Mocks
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => { throw new Error('NEXT_REDIRECT') }),
}))

describe('requireAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to /login if no session exists', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null)
    
    await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT')
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('should throw an error if user is just USER', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: '1', role: 'USER', email: 'test@test.com' },
      expires: '123'
    })
    
    await expect(requireAdmin()).rejects.toThrow('Forbidden: você não tem permissão para executar esta ação.')
  })

  it('should return session if user is ADMIN', async () => {
    const mockSession = {
      user: { id: '1', role: 'ADMIN' as const, email: 'test@test.com' },
      expires: '123'
    }
    vi.mocked(auth).mockResolvedValueOnce(mockSession)
    
    const session = await requireAdmin()
    
    expect(session).toEqual(mockSession)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should return session if user is MANAGER', async () => {
    const mockSession = {
      user: { id: '1', role: 'MANAGER' as const, email: 'test@test.com' },
      expires: '123'
    }
    vi.mocked(auth).mockResolvedValueOnce(mockSession)
    
    const session = await requireAdmin()
    
    expect(session).toEqual(mockSession)
    expect(redirect).not.toHaveBeenCalled()
  })
})
