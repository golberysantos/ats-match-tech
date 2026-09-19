# ATS MATCH TECH - Otimizador de Currículo para ATS - Nicho Tech Junior

## OBJETIVO
Crie uma aplicação web chamada ATS Match Tech. Ela compara currículo em PDF com descrição de vaga e gera versão ATS Friendly. Nicho: primeiro emprego e vagas junior em tecnologia.

## STACK OBRIGATÓRIA - RESTRIÇÃO MÁXIMA
- React + TypeScript + Tailwind CSS + shadcn/ui APENAS
- Use SOMENTE estes componentes shadcn: Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Textarea, Badge, Progress, Tabs, TabsList, TabsTrigger, TabsContent, Separator, Dialog
- PROIBIDO: criar div com className custom arbitrário, usar style prop, criar CSS custom. Use sempre componentes shadcn.
- Biblioteca: pdfjs-dist para ler PDF no cliente. Use CDN para worker: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`
- Ícones: lucide-react
- Persistência: localStorage key `ats_vagas`

## FLUXO E ESTRUTURA - PÁGINA ÚNICA
Header: Título "ATS Match Tech" + subtítulo "Passe no ATS de vagas de tecnologia"
Layout: max-w-5xl mx-auto p-4 com Tabs shadcn

Tab 1 - "Criar Vaga":
- Card com Form: Input para Título da vaga, Input para Empresa, Textarea grande para Descrição completa colada do LinkedIn/Gupy
- Button Salvar Vaga -> salva em localStorage
- Abaixo, lista de vagas salvas em Cards com título, empresa, 2 linhas da descrição e Button "Usar esta vaga" que seta vagaSelecionada e muda para Tab 2

Tab 2 - "Analisar Currículo":
- Se vagaSelecionada == null: mostrar Card com aviso "Selecione uma vaga na Tab 1"
- Se tem vaga: mostrar Card da vaga selecionada + Input type file PDF + Button Analisar com loading state
- Lógica após upload:
    1. Ler PDF com pdfjs-dist no cliente e extrair texto
    2. Chamar analisarMatch(descricaoVaga, textoCV) e calcularChance(scoreATS, textoCV)
    3. Mostrar 4 Cards na ordem:
     Card A - Score ATS: número grande + Progress
     Card B - ChanceCard: Estimativa de Compatibilidade com % inteiro cap 95, Badge com level baixa/media/alta/excelente, Progress, lista de fatores, disclaimer pequeno "*Não é garantia de contratação"
     Card C - Keywords: duas colunas - Encontradas com Badge variant default e Faltantes com Badge variant destructive
     Card D - CV ATS Friendly: Textarea readOnly com texto gerado + Buttons Copiar e Download TXT

## LÓGICA DE NEGÓCIO - COPIE EXATO
Crie arquivo lib/atsAnalyzer.ts com:

- extrairKeywordsDaVaga(descricao): lowerCase, remove acento, remove pontuação, filtra stopwords e palavras <4 letras, junta com lista base tech [javascript, typescript, react, node, nextjs, html, css, tailwind, git, api, rest, sql, docker, aws, scrum], retorna até 40 únicas
- analisarMatch(descricao, textoCV): compara com includes, calcula scoreATS = encontradas/total*100 arredondado, gera cvOtimizado com template limpo sem colunas: RESUMO, HABILIDADES, EXPERIENCIA, FORMACAO, CONTATO
- calcularChance(scoreATS, textoCV): 60% scoreATS + 25% completude [tem experiencia, habilidades, formacao, contato @] + 15% tamanho [>800 chars]. raw = soma, score final = Math.min(95, Math.round(raw)). NUNCA 100%. Level: 0-39 baixa, 40-69 media, 70-89 alta, 90-95 excelente. Retorna {score, level, label, fatores: [string com % keywords, % secoes, tamanho]}

## DESIGN SYSTEM
- Paleta: primary hsl(221 83% 53%), background white, foreground hsl(222 47% 11%), muted hsl(210 40% 96%), verde sucesso hsl(142 76% 36%), destructive hsl(0 84% 60%)
- Fonte Inter
- Cards com shadow-sm, border-l-4 border-l-primary para destaque
- Progress h-2
- Todos os textos com text-muted-foreground quando secundário

## SEO + GEO - OBRIGATÓRIO NO INDEX
- Title: ATS Match Tech - Otimize seu currículo para passar no ATS de vagas de tecnologia
- Meta description: Cole sua vaga tech e seu currículo em PDF. Veja score de compatibilidade, chance estimada, palavras-chave que faltam e gere versão 100% ATS friendly para primeiro emprego.
- H1 na página: Otimizador de Currículo ATS para Vagas Tech Junior
- Footer com FAQ com 3 perguntas: O que é ATS? Como funciona a análise? Por que meu currículo não passa?
- Adicione JSON-LD FAQ Schema no head para GEO

## O QUE NÃO FAZER
- Não usar backend, Supabase ou API externa
- Não criar pastas desnecessárias
- Não usar cores fora da paleta
- Código simples, funcional, pronto para publicar

Gere a aplicação completa agora.