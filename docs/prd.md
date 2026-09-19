# PRD - ATS Match Tech
## Product Requirements Document - Otimizador de Currículo para ATS

### 1. Visão Geral e Problema

**Problema Central:** 
70% dos currículos são descartados antes de chegar ao RH humano porque o ATS (Applicant Tracking System) não encontrou palavras-chave da vaga. O problema é mais crítico para candidatos de tecnologia em primeiro emprego/junior que usam templates bonitos com colunas, ícones e gráficos - ilegíveis para ATS.

**Solução Proposta:**
Uma aplicação web client-side que compara a descrição de uma vaga tech com um currículo em PDF, calcula compatibilidade, expõe gaps de palavras-chave e gera uma versão 100% ATS Friendly pronta para download.

**Nicho Especializado:** Vagas de Tecnologia - Frontend, Backend, Fullstack - Nível Estágio e Junior. Decisão estratégica para SEO e GEO.

### 2. Personas

**Persona Primária - Candidato Tech Junior (80% do foco)**
- Nome: Gabriel, 22 anos
- Dor: Envia 50 currículos, 0 retornos. Não sabe por que o ATS barra.
- Objetivo: Entender o que falta e ter um CV que passe no filtro automático.
- Comportamento: Cola descrição do LinkedIn/Gupy e anexa PDF.

**Persona Secundária - Recrutador Tech / Mentor**
- Cria vagas de exemplo para alunos/mentorados testarem aderência.

### 3. Jornada do Usuário e Fluxos

**Fluxo Principal (Happy Path):**
```
1. Usuário acessa / -> Vê Header + Tabs
2. Tab "Criar Vaga" -> Preenche Título, Empresa, Descrição completa -> Salva (localStorage)
3. Lista de Vagas -> Clica em "Usar esta vaga" -> Sistema seta vagaSelecionada e navega para Tab "Analisar"
4. Tab "Analisar" -> Mostra Card da vaga selecionada -> Upload PDF do currículo -> Clica "Analisar"
5. Sistema: pdfjs-dist extrai texto -> analisarMatch() -> calcularChance()
6. Exibe 4 Cards de Resultado:
   - Score ATS (0-100%)
   - Estimativa de Compatibilidade / Chance (0-95% com cap para evitar overpromising)
   - Keywords Encontradas (verde) e Faltantes (vermelho)
   - CV ATS Friendly gerado com Textarea + Botões Copiar e Download
7. Usuário copia/baixa e envia para vaga real
```

**Fluxo Alternativo:**
- Sem vaga selecionada: Tab Analisar mostra estado vazio com CTA para criar vaga
- PDF inválido/sem texto: Toast de erro "Não foi possível ler o PDF"
- Vaga sem descrição: Validação bloqueia salvamento

### 4. Requisitos Funcionais

**RF01 - Gerenciamento de Vagas**
- Criar vaga com: título (string, required), empresa (string, optional), descrição (textarea, required, min 100 chars)
- Listar vagas salvas (localStorage key `ats_vagas`)
- Selecionar vaga para análise
- Deletar vaga
- Critério de aceite: Vagas persistem após reload

**RF02 - Upload e Parse de PDF**
- Input file aceitando apenas .pdf
- Parse client-side com pdfjs-dist, sem envio para servidor
- Extrair texto completo, mesmo de PDFs com 2 colunas (best effort)
- Loading state no botão Analisar durante parse
- Critério: Funcionar com PDFs gerados por Canva, Word e Google Docs

**RF03 - Motor de Análise ATS**
- Função `extrairKeywordsDaVaga(descricao: string): string[]`
  - Normalização: lowercase, remover acentos, remover pontuação
  - Remover stopwords PT-BR
  - Merge com base tech fixa: javascript, typescript, react, node, nextjs, html, css, tailwind, git, api, rest, sql, docker, aws, scrum
  - Retornar até 40 keywords únicas
- Função `analisarMatch(descricao, textoCV): {scoreATS, encontradas, faltantes, cvOtimizado}`
  - scoreATS = (encontradas.length / total) * 100, inteiro
  - Geração ATS: template sem colunas, sem ícones, sem tabelas: RESUMO, HABILIDADES TÉCNICAS, EXPERIÊNCIA, FORMAÇÃO, CONTATO

**RF04 - Estimativa de Compatibilidade / Chance**
- Função `calcularChance(scoreATS, textoCV): HiringChance`
  - Fórmula: 60% scoreATS + 25% completude (tem experiência, habilidades, formação, contato) + 15% tamanho (>800 chars)
  - Score final = Math.min(95, Math.round(raw)) - NUNCA 100% para evitar falsa promessa
  - Levels: 0-39 baixa, 40-69 media, 70-89 alta, 90-95 excelente
  - Deve retornar fatores explicáveis para GEO

**RF05 - Geração e Exportação**
- Textarea readonly com CV otimizado
- Botão Copiar (navigator.clipboard)
- Botão Download .txt (Blob)
- Futuro: Download PDF limpo

### 5. Requisitos Não-Funcionais

**RNF01 - Stack e Design System**
- React + TypeScript + Tailwind
- APENAS shadcn/ui: Button, Card, Badge, Progress, Tabs, Input, Textarea, Separator. Proibido div com style custom.
- Paleta Tech Trust: Primary hsl(221 83% 53%) #2563EB, Success hsl(142 76% 36%), Destructive hsl(0 84% 60%)
- Fonte Inter
- Responsivo mobile-first, WCAG AA

**RNF02 - Performance e Privacidade**
- 100% client-side, nenhum dado sai do browser
- Parse de PDF < 3s para arquivos de até 5MB
- Sem backend, sem Supabase no MVP
- Sem chaves, tokens ou secrets no repo

**RNF03 - SEO e GEO**
- Title, Meta Description, H1 otimizado para "otimizador de currículo ats tech junior"
- Footer com FAQ (O que é ATS? Como funciona? Por que meu CV não passa?)
- JSON-LD FAQ Schema para ser citado por IAs
- Conteúdo com listas passo a passo para GEO

### 6. Fora do Escopo MVP

- Login / Autenticação
- Backend / Banco de dados
- Integração com LLM externo (OpenAI) - deixado para V2
- Geração de PDF com design
- Sistema de pagamento

### 7. Métricas de Sucesso (para portfólio)

- Aplicação publicada e acessível via URL Lovable
- Análise funciona end-to-end com vaga real + PDF real
- Print da análise com Score, Chance e Keywords
- README com problema, prompt, como funciona e link
- Repositório público na conta do autor, sem secrets

### 8. Riscos e Mitigações

- Risco: pdfjs-dist worker falha no Lovable -> Mitigação: usar CDN worker
- Risco: Score sempre 0 -> Mitigação: normalizar acentos antes do includes()
- Risco: Prometer 100% de contratação -> Mitigação: Cap em 95% + disclaimer + label "Compatibilidade" e não "Chance de contratação"

### 9. Próximos Passos Pós-MVP

- V2: Integração com OpenAI para reescrita semântica do CV
- V3: Auth + histórico de análises + Supabase
- V4: Geração de PDF ATS com layout limpo
