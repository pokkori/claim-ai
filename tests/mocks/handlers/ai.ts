import { http, HttpResponse } from 'msw'

export const aiHandlers = [
  http.post('/api/generate', () =>
    HttpResponse.json({ content: 'テストコンテンツ' })
  ),
  http.post('/api/generate/error', () =>
    new HttpResponse(null, { status: 429, headers: { 'retry-after': '60' } })
  ),
]
