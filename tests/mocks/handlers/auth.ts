import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.get('/api/auth/status', () =>
    HttpResponse.json({ authenticated: false, plan: 'free' })
  ),
  http.get('/api/auth/status/premium', () =>
    HttpResponse.json({ authenticated: true, plan: 'premium' })
  ),
]
