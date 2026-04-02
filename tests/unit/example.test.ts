import { describe, it, expect } from 'vitest'

describe('基本テスト', () => {
  it('環境が正常に動作する', () => {
    expect(1 + 1).toBe(2)
  })

  it('文字列操作が正常に動作する', () => {
    const text = 'AIサービス'
    expect(text).toContain('AI')
  })
})
