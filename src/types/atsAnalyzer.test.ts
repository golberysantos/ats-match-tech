// atsAnalyzer.test.ts
import { calcularChance } from './atsAnalyzer';

test('nunca deve retornar 100%', () => {
  const c = calcularChance(100, 'a'.repeat(2000) + ' experiencia habilidades formacao @');
  expect(c.score).toBeLessThanOrEqual(95);
});

test('deve classificar como baixa com score baixo', () => {
  const c = calcularChance(10, 'curto');
  expect(c.level).toBe('baixa');
});