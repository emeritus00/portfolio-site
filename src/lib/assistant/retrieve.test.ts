import { describe, expect, it } from 'vitest'
import { answer, suggestions } from './retrieve'

const top = (q: string) => answer(q).doc?.id

describe('site assistant retrieval', () => {
  it.each([
    ['What does he build?', 'projects'],
    ['Is he AWS certified?', 'certs'],
    ['How does he approach testing?', 'testing'],
    ['How does he use AI?', 'ai'],
    ['Why the switch to software?', 'path'],
    ['How do I contact him?', 'contact'],
    ['Tell me about CarPadi', 'project-carpadi'],
    ['what is bimz food hub', 'project-bimz-food-hub'],
    ['does he know spring boot and postgres', 'stack'],
    ['where is he based', 'location'],
    ['his masters research at memorial', 'sediment'],
    ['what did he study', 'education'],
    ['car inspection experience', 'automotive'],
    ['how does this chatbot work', 'assistant'],
  ])('%s → %s', (q, id) => {
    expect(top(q)).toBe(id)
  })

  it('answers every suggested question', () => {
    suggestions.forEach((q) => expect(answer(q).doc).not.toBeNull())
  })

  it('declines questions the site cannot answer', () => {
    expect(answer('what is the capital of peru').doc).toBeNull()
    expect(answer('   ').doc).toBeNull()
  })
})
