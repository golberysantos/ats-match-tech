# Roadmap - ATS Match Tech - Evolução para Produto Real

## Visão
Transformar o MVP client-side em um produto com reescrita semântica real usando LLM, mantendo privacidade e custo baixo.

## V1 - Atual - MVP Entregue ✅
- CRUD de vagas em localStorage
- Parse PDF com pdfjs-dist client-side
- Motor de match por keywords (includes)
- Score ATS + Estimativa de Compatibilidade com cap 95%
- Geração de CV template limpo
- 100% shadcn/ui, sem backend
- Status: Publicado em https://captured-visage.lovable.app

## V2 - Reescrita Inteligente com LLM - Próximo Passo (2-3 dias)
**Objetivo:** Em vez de só listar keywords, reescrever o CV inserindo as faltantes de forma natural.

**Arquitetura:**
```
[Frontend Lovable] -> Edge Function (Lovable Cloud / Supabase Functions)
                    -> OpenAI API gpt-4o-mini com prompt restrito
                    -> Retorna CV reescrito + justificativa
```

**Prompt do LLM (system):**
> Você é um especialista em ATS. Reescreva o currículo abaixo para incluir naturalmente estas keywords faltantes: {faltantes}. Não invente experiências. Mantenha formato ATS: sem colunas, sem ícones, seções em MAIÚSCULAS. Retorne apenas o texto do CV.

**Mudanças no código:**
- Criar `supabase/functions/reescrever-cv/index.ts`
- Novo botão "Reescrever com IA" no Card CV ATS Friendly
- Adicionar `OPENAI_API_KEY` no secrets do Lovable (nunca no repo)
- Fallback: se falhar, mantém geração template atual

**Custo estimado:** gpt-4o-mini ~$0.002 por reescrita

**Design Pattern:** Strategy - `AtsGenerator` interface com duas implementações: `TemplateGenerator` (atual) e `LLMGenerator` (nova)

## V3 - Autenticação e Histórico
- Lovable Auth + Supabase
- Tabela `vagas`, `analises` com RLS
- Histórico de análises por usuário
- Dashboard com evolução de score

## V4 - Monetização e GEO Avançado
- Limite de 3 análises grátis, depois paywall
- Geração de PDF final com layout ATS limpo usando @react-pdf/renderer
- Blog com conteúdo: "Como passar no ATS de vagas React Junior" para dominar GEO
- JSON-LD JobPosting + FAQ para ser citado por ChatGPT/Perplexity

## V5 - Marketplace
- Templates de CV por stack: Frontend, Backend, Dados
- Integração com Gupy/LinkedIn para importar vaga via URL
- Score de legibilidade + sugestões de verbos de ação

## Decisões Técnicas para V2
- Não usar LangChain - overengineering para este caso
- Usar Edge Function e não chamar OpenAI direto do frontend (exporia key)
- Manter pdfjs-dist client-side por privacidade - PDF nunca vai para OpenAI, apenas texto extraído anonimizado
- Adicionar rate limiting na edge function: 10 req/min por IP

## Checklist V2
- [ ] Criar função Supabase
- [ ] Configurar secret OPENAI_API_KEY
- [ ] Novo componente `RewriteWithAIButton.tsx` (shadcn Button + loading)
- [ ] Atualizar PRD.md com RF06 - Reescrita com IA
- [ ] Teste com CV real + vaga real - print do antes/depois
