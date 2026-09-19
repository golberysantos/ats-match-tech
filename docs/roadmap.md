# Roadmap


### 1. Por onde começar

**Fase 1 - Fundação **
- Criar repositório: `ats-match-tech` [minúsculas, sem acento][Hoje]
- Criar `PRD.md` e `MEGA_PROMPT.md`
- Definir nicho: **Vagas de Tecnologia - Dev Junior / Estágio** - melhor para SEO e para IA entender o contexto

**Fase 2 - Geração no Lovable**
- Colar mega prompt restritivo
- Conectar GitHub no Lovable antes de gerar para já exportar

**Fase 3 - Refinamento [pós-geração]**
- Ajustes de prompt que sempre são necessários - já mapeei abaixo

**Fase 4 - Publicação e README**

### 2. Arquitetura para o MVP - sem over-engineering

Não precisa de back-end complexo. Tudo client-side para o Lovable não quebrar.

```
[Usuário Recrutador] -> Cria Vaga (título + descrição) -> localStorage
[Usuário Candidato] -> Lista Vagas -> Upload PDF -> pdfjs-dist (client) -> Extrai texto
-> Algoritmo de Match:
  1. Normaliza descrição da vaga [lowercase, stopwords]
  2. Extrai keywords [regex de tech stack + TF]
  3. Compara com texto do CV [includes]
  4. Calcula Score = encontradas / total * 100
-> Gera CV ATS: reescreve com seções padrão
-> Download.txt /.pdf
```

**Anti-patterns para evitar:**
- God Component fazendo tudo - quebrar em `VagaForm`, `PdfUploader`, `MatchResult`, `AtsPreview`
- Salvar PDF no banco sem necessidade - use `pdfjs-dist` no browser
- Usar IA externa sem fallback - para MVP, faça match por keywords, depois evolui para OpenAI

### 3. PRD - Cole isso no seu `PRD.md`

```markdown
# PRD - ATS Match Tech

## Problema
Currículos em PDF com design bonito são barrados por ATS por falta de palavras-chave da vaga. Candidato junior não sabe o que falta.

## Persona
Candidato tech em primeiro emprego buscando vaga de Dev Frontend/React/Node.

## Fluxo Principal
1. Recrutador/Candidato cria vaga: título, empresa, descrição completa colada do LinkedIn/Gupy
2. Candidato seleciona vaga da lista
3. Anexa currículo PDF
4. Sistema mostra:
   - Score de match 0-100%
   - Keywords encontradas [badge verde]
   - Keywords faltantes [badge vermelho]
   - Sugestões de onde inserir
5. Gera versão ATS Friendly: sem colunas, sem ícones, com seções: Resumo, Experiência, Habilidades, Educação. Pronto para download.

## Requisitos Funcionais
- CRUD de vagas em localStorage
- Upload PDF + parse client-side
- Análise de match
- Geração de CV otimizado
- Download

## Requisitos Não-Funcionais
- 100% shadcn/ui, sem div custom com style inline
- Responsivo, WCAG AA
- SEO + GEO otimizado para "otimizador de curriculo ats tech"
- Sem chaves expostas

## Fora do Escopo MVP
- Login, backend, pagamento
```

### 4. Design System - para o Mega Prompt

Use isso para não deixar o Lovable inventar:

- **Framework:** React + TypeScript + Tailwind + shadcn/ui APENAS. Proibido criar divs customizadas com classes arbitrárias, use sempre `<Card>`, `<Button>`, `<Badge>`, `<Textarea>`, etc.
- **Paleta - Tech Trust:**
  - Primary: `hsl(221 83% 53%)` - Azul #2563EB
  - Background: `hsl(0 0% 100%)`
  - Foreground: `hsl(222 47% 11%)`
  - Muted: `hsl(210 40% 96%)`
  - Accent: `hsl(142 76% 36%)` - Verde para match
  - Destructive: `hsl(0 84% 60%)` - Vermelho para faltantes
- **Fonte:** Inter
- **Tom:** Profissional, limpo, como Linear / Vercel

### 5. MEGA PROMPT - Pronto para colar no Lovable [Versão Final Otimizada]

Salve como `MEGA_PROMPT.md` no repo. Este é restritivo para economizar crédito:

```markdown
# ATS MATCH TECH - Aplicação Web para Otimização de Currículo para ATS - Nicho Tech Junior

## OBJETIVO
Crie uma aplicação web chamada ATS Match Tech que compara currículo PDF com descrição de vaga e gera versão ATS Friendly. Nicho: vagas de tecnologia para primeiro emprego e junior.

## STACK OBRIGATÓRIA
- React, TypeScript, Tailwind CSS
- Use APENAS componentes de shadcn/ui: Button, Card, CardHeader, CardContent, Input, Textarea, Badge, Progress, Tabs, Dialog, Separator. NÃO crie divs com estilo custom, NÃO use style prop, NÃO invente componentes.
- Biblioteca pdfjs-dist para ler PDF no cliente
- lucide-react para ícones
- Persistência de vagas em localStorage com key `ats_vagas`

## ESTRUTURA DE PÁGINAS / FLUXO
Página única com 2 Tabs (shadcn Tabs):
Tab 1 - "Criar Vaga": Form com Input para título da vaga e Textarea para descrição completa. Button Salvar. Lista de vagas salvas abaixo em Cards com Button "Usar esta vaga".
Tab 2 - "Analisar Currículo":
- Se nenhuma vaga selecionada, mostrar aviso "Selecione uma vaga na Tab 1"
- Se vaga selecionada: mostrar Card da vaga + Input file PDF + Button Analisar
- Após análise: mostrar 3 Cards:
  1. Score: Progress com % e texto explicativo
  2. Keywords: duas listas com Badge - Encontradas (verde) e Faltantes (vermelho)
  3. CV ATS Friendly: Textarea readOnly com versão gerada + Buttons Download TXT e Copiar

## LÓGICA DE ANÁLISE - IMPORTANTE
Função `analisarMatch(descricaoVaga: string, textoCV: string)`:
1. Crie lista base de tech keywords: react, javascript, typescript, node, git, html, css, api, rest, sql, etc + extraia palavras da vaga com mais de 4 letras que não sejam stopwords.
2. Normaliza tudo para lowercase.
3. Verifica quais keywords da vaga existem no CV com `includes`.
4. Calcula score = encontradas.length / total * 100
5. Geração ATS: Crie template limpo:
```
[Nome do Candidato - extrair do PDF ou usar placeholder]
RESUMO PROFISSIONAL:...
HABILIDADES TÉCNICAS: listar todas as encontradas + faltantes como "Em desenvolvimento"
EXPERIÊNCIA: manter do original mas inserir keywords faltantes de forma natural
FORMAÇÃO
```
Retorne objeto { score, encontradas, faltantes, cvOtimizado }

## DESIGN
- Layout centrado max-w-5xl, Header com título e subtítulo
- Use paleta: primary hsl(221 83% 53%), background white, foreground hsl(222 47% 11%)
- Todos os Cards com shadow-sm
- Badges: variant default para encontradas, variant destructive para faltantes

## SEO E GEO
No index.html:
- Title: ATS Match Tech - Otimize seu currículo para passar no ATS de vagas de tecnologia
- Meta description: Cole sua vaga de tecnologia e seu currículo em PDF. Veja seu score de compatibilidade, palavras-chave que faltam e gere uma versão 100% ATS friendly para primeiro emprego.
- H1: Otimizador de Currículo ATS para Vagas Tech
- Adicione FAQ em footer com 3 perguntas sobre o que é ATS, como funciona, por que tech junior
- JSON-LD FAQ Schema para GEO

## O QUE NÃO FAZER
- Não use backend, não use Supabase neste MVP
- Não crie pastas desnecessárias
- Não use cores fora da paleta
- Mantenha código simples e funcional

Gere a aplicação completa e funcional.
```

### 6. Ajustes que você VAI precisar pedir depois da 1ª geração no Lovable

Isso é normal, já deixe anotado no README:

1. **Prompt de ajuste 1:** `Corrija o parse do PDF. Está dando erro de worker. Use pdfjs-dist com `import * as pdfjsLib from 'pdfjs-dist'; pdfjsLib.GlobalWorkerOptions.workerSrc =...` cdn`
2. **Prompt de ajuste 2:** `O score está sempre 0. Corrija a função analisarMatch para fazer normalize removendo acentos e pontuação`
3. **Prompt de ajuste 3:** `Adicione loading state no Button Analisar e desabilite se não houver PDF`

Cada ajuste consome pouco se for cirúrgico assim.

### 7. SEO + GEO - Para ser encontrado por Google e por IAs

No seu Lovable, já está no prompt, mas confira:

- **SEO:** URL `/`, H1 único, meta tags, sitemap, OpenGraph
- **GEO:** Texto explicativo "Como funciona: 1. Cole a vaga 2. Anexe PDF 3. Veja match" - IAs adoram listas passo a passo. Adicione bloco "Para quem é" com "desenvolvedor junior, estagiário, primeiro emprego em tecnologia"

### 8. README.md - Template que a banca quer ver

```markdown
# ats-match-tech

## Problema que resolve
70% dos currículos são barrados antes do RH por ATS. Juniors não sabem quais palavras-chave usar. Esta app resolve comparando vaga x CV e gerando versão ATS friendly.

## Link da aplicação
https://seu-projeto.lovable.app

## Mega Prompt
[cole o MEGA_PROMPT.md]
### Evolução do prompt
- v1: prompt inicial
- v2: adicionei restrição de shadcn apenas para reduzir créditos
- v3: adicionei lógica de pdfjs worker cdn após erro

## Como a análise funciona
Vaga colada -> normalização -> extração de keywords tech -> PDF parseado no browser com pdfjs-dist -> comparação includes -> score -> geração de template sem colunas/ícones

## Ajustes pós-geração
1. Correção do worker do PDF
2. Melhoria do cálculo de score
3. Loading states

## Como rodar local
npm i && npm run dev
```

### 9. Checklist final antes de submeter

- [ ] Repo público na SUA conta
- [ ] Nome minúsculo sem acento
- [ ] App Lovable publicada e abre em aba anônima
- [ ] README com todos os 5 tópicos
- [ ] Sem `.env` com token
- [ ] Print da análise na pasta `/docs`

Quer que eu já gere o `PRD.md`, `MEGA_PROMPT.md` e `README.md` como arquivos prontos para você dar push? Me diga o nome do repo que quer usar que eu já crio os 3 arquivos aqui.