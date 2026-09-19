// src/lib/atsAnalyzer.ts

export type HiringChanceLevel = 'baixa' | 'media' | 'alta' | 'excelente';

export interface HiringChance {
  score: number; // 0-95, inteiro
  level: HiringChanceLevel;
  label: string;
  fatores: string[];
}

export interface MatchResult {
  scoreATS: number;
  encontradas: string[];
  faltantes: string[];
  cvOtimizado: string;
}

const TECH_KEYWORDS_BASE = [
  'javascript','typescript','react','node','nextjs','vue','angular',
  'html','css','tailwind','git','github','api','rest','graphql',
  'sql','nosql','docker','aws','scrum','agile'
];

const STOPWORDS = new Set(['para','com','como','esta','essa','pela','pelo','uma','onde','seu','sua','dos','das','nos']);

export function extrairKeywordsDaVaga(descricao: string): string[] {
  const normalizada = descricao.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
  
  const palavras = normalizada.split(/\s+/)
    .filter(p => p.length > 3 && !STOPWORDS.has(p));

  const unicas = new Set([...TECH_KEYWORDS_BASE, ...palavras]);
  return Array.from(unicas).slice(0, 40); // cap para não poluir
}

export function analisarMatch(descricaoVaga: string, textoCV: string): MatchResult {
  const keywords = extrairKeywordsDaVaga(descricaoVaga);
  const cvLower = textoCV.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const encontradas = keywords.filter(k => cvLower.includes(k));
  const faltantes = keywords.filter(k => !cvLower.includes(k));
  
  const scoreATS = keywords.length === 0 ? 0 : Math.round((encontradas.length / keywords.length) * 100);

  // Geração ATS simples e funcional
  const cvOtimizado = `RESUMO PROFISSIONAL
Candidato com foco em ${encontradas.slice(0,5).join(', ')} buscando oportunidade em tecnologia.

HABILIDADES TECNICAS
${encontradas.join(', ')}
${faltantes.length > 0 ? `\nEm desenvolvimento: ${faltantes.slice(0,5).join(', ')}` : ''}

EXPERIENCIA PROFISSIONAL
${textoCV.slice(0, 800)}

FORMACAO
[Manter do CV original]

CONTATO
[Manter email e LinkedIn do CV original]
`.trim();

  return { scoreATS, encontradas, faltantes, cvOtimizado };
}

export function calcularChance(scoreATS: number, textoCV: string): HiringChance {
  const temExperiencia = /experiencia|experience/i.test(textoCV);
  const temHabilidades = /habilidades|skills|tecnologias/i.test(textoCV);
  const temFormacao = /formacao|educacao|education|graduacao/i.test(textoCV);
  const temContato = /@|linkedin|github\.com/i.test(textoCV);

  const completude = [temExperiencia, temHabilidades, temFormacao, temContato].filter(Boolean).length / 4;
  const tamanhoOk = textoCV.length > 800 ? 1 : textoCV.length / 800;

  // Ponderação: 60% keywords + 25% completude + 15% tamanho
  const raw = (scoreATS * 0.6) + (completude * 100 * 0.25) + (tamanhoOk * 100 * 0.15);
  
  // TRAVA DE PRODUTO: nunca 100%, cap em 95% para não prometer contratação
  const score = Math.min(95, Math.round(raw));

  let level: HiringChanceLevel = 'baixa';
  if (score >= 90) level = 'excelente';
  else if (score >= 70) level = 'alta';
  else if (score >= 40) level = 'media';

  const labels: Record<HiringChanceLevel, string> = {
    baixa: 'Baixa compatibilidade',
    media: 'Compatibilidade média',
    alta: 'Alta compatibilidade',
    excelente: 'Compatibilidade excelente'
  };

  return {
    score,
    level,
    label: labels[level],
    fatores: [
      `${scoreATS}% das palavras-chave da vaga encontradas`,
      `${Math.round(completude * 100)}% de seções essenciais preenchidas`,
      tamanhoOk === 1 ? 'Tamanho adequado para leitura do ATS' : 'Currículo muito curto - ATS pode penalizar'
    ]
  };
}