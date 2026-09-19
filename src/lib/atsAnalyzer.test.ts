import { analisarMatch, calcularChance } from './atsAnalyzer';

describe('ATS Analyzer - Testes de Lógica', () => {
  test('deve calcular score corretamente', () => {
    const vaga = 'react javascript typescript tailwind api rest git scrum';
    const cv = 'Tenho experiência com react e javascript e git';
    const { scoreATS, encontradas, faltantes } = analisarMatch(vaga, cv);
    
    expect(encontradas).toContain('react');
    expect(faltantes).toContain('typescript');
    expect(scoreATS).toBeGreaterThan(30);
    expect(scoreATS).toBeLessThan(70);
  });

  test('chance nunca deve ser 100% - trava de produto', () => {
    const chance = calcularChance(100, 'experiencia habilidades formacao @ '.repeat(50));
    expect(chance.score).toBeLessThanOrEqual(95);
    expect(chance.level).toBe('excelente');
  });

  test('deve penalizar CV muito curto', () => {
    const chanceCurto = calcularChance(80, 'curto');
    const chanceLongo = calcularChance(80, 'a'.repeat(1000) + ' experiencia habilidades formacao @');
    expect(chanceLongo.score).toBeGreaterThan(chanceCurto.score);
  });
});