# ats-match-tech

> Currículo bom que nunca chega no RH porque o ATS barrou antes. Esta aplicação resolve isso para vagas de tecnologia.

## 1. Qual problema a sua aplicação resolve

70% dos currículos são descartados pelo ATS antes de chegar no humano. Candidatos junior usam templates do Canva com colunas, ícones e cores que o ATS não lê e não sabem quais palavras-chave da vaga estão faltando.

O **ATS Match Tech** é um otimizador 100% client-side:
- Você cola a descrição da vaga (LinkedIn/Gupy)
- Anexa seu currículo em PDF
- A aplicação extrai o texto com `pdfjs-dist` no browser, sem enviar para servidor
- Mostra Score ATS, Estimativa de Compatibilidade (com cap de 95% para não prometer contratação), palavras-chave encontradas e faltantes
- Gera uma versão ATS Friendly limpa, sem colunas, pronta para download

Nicho: **Vagas de tecnologia - Estágio e Junior - Frontend / Fullstack**

## 2. Link da Aplicação

**URL Publicada:** https://captured-visage.lovable.app
**Preview Lovable:** https://lovable.dev/preview/0wMEfYBT5Ta5v1Gb4DYUHmmvfniCKLvb

**Exemplo de Teste:** Score 76% -> 86% de compatibilidade alta após correção de stopwords (buscamos, nacoes)

**Repositório:** https://github.com/golberysantos/ats-match-tech

## 3. O mega prompt que você usou, e o que mudou nele até a versão final

Todo o histórico está documentado em [`MEGA_PROMPT.md`](./MEGA_PROMPT.md).

Resumo da evolução:
- **V1:** Fluxo base de criar vaga + analisar PDF
- **V2 Final:** Adição da feature de Estimativa de Compatibilidade com fórmula 60% keywords + 25% completude + 15% tamanho e cap em 95%. Restrição máxima de shadcn/ui apenas e definição do worker CDN do pdfjs-dist para corrigir erro comum do Lovable. Especialização para nicho tech junior para SEO/GEO.

Veja detalhes completos no arquivo `MEGA_PROMPT.md`.

## 4. Como a análise funciona, da vaga colada até o currículo ajustado

```
[Vaga colada] -> extrairKeywordsDaVaga()
  - normaliza: lowercase + remove acento + remove pontuação
  - remove stopwords PT-BR
  - merge com base tech fixa: javascript, typescript, react, node, etc
  - retorna até 40 keywords únicas

[PDF anexado] -> pdfjs-dist no cliente
  - worker via CDN
  - extrai texto de todas as páginas
  - concatena

[Match] -> analisarMatch()
  - encontradas = keywords.filter(k => textoCV.includes(k))
  - faltantes = keywords.filter(k => !textoCV.includes(k))
  - scoreATS = encontradas.length / total * 100

[Chance] -> calcularChance()
  - completude = temExperiencia, temHabilidades, temFormacao, temContato / 4
  - tamanhoOk = textoCV.length > 800 ? 1 : textoCV.length / 800
  - raw = scoreATS*0.6 + completude*100*0.25 + tamanhoOk*100*0.15
  - score = Math.min(95, Math.round(raw)) - nunca 100%

[Geração ATS] -> template limpo
  RESUMO + HABILIDADES + EXPERIENCIA + FORMACAO + CONTATO
  Sem colunas, sem ícones, sem tabelas - 100% legível para ATS
```

Stack: React + TypeScript + Tailwind + shadcn/ui + pdfjs-dist + lucide-react. Persistência de vagas em localStorage.

## 5. Que ajustes você pediu depois da primeira geração, e por quê

1.  **Worker do PDF:** `Corrija o pdfjs-dist worker usando CDN https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js` - Motivo: erro `Failed to fetch worker` na primeira geração.
2.  **Score inteiro e cap 95%:** `No calcularChance, use Math.round e Math.min(95, raw) e nunca mostre decimal` - Motivo: evitar falsa precisão e overpromising de contratação.
3.  **Loading e validação:** `Adicione loading state no Button Analisar e validação de min 100 chars na descrição` - Motivo: UX e evitar análise vazia.
4.  **ChanceCard com shadcn:** `Crie ChanceCard usando apenas Card, Badge, Progress, Separator` - Motivo: manter consistência do Design System e economizar créditos.

## 6. Como acessar

Acesse o link: https://captured-visage.lovable.app/

## 7. Evidências

Adicione na pasta `/docs`:
- `print-analise.png` - Print da tela com Score, Chance, Keywords e CV gerado
- `exemplo-vaga.txt` - Descrição de vaga real usada
- `exemplo-cv.pdf` - CV de teste (sem dados sensíveis)

## 7.1 Exemplo de Teste Real (evidência)

### Vaga usada para teste
**Título:** Desenvolvedor Frontend Junior - React
**Descrição:** Buscamos dev com React, JavaScript, TypeScript, HTML, CSS, Tailwind, Git, consumo de API REST, noções de Scrum.

### Currículo de teste
PDF de 1 página com experiência em projetos pessoais em React.

### Resultado esperado da análise
- **Score ATS:** ~65%
- **Chance / Compatibilidade:** 68% - Compatibilidade média
- **Encontradas:** react, javascript, html, css, git
- **Faltantes:** typescript, tailwind, api rest, scrum
- **CV Gerado:** Versão limpa com HABILIDADES TÉCNICAS contendo as encontradas + faltantes como "Em desenvolvimento"

### Como reproduzir
1. Criar vaga com a descrição acima
2. Usar vaga -> Anexar `docs/exemplo-cv.pdf`
3. Clicar Analisar -> Validar 4 Cards

## 8. SEO e GEO

- Title otimizado: "ATS Match Tech - Otimize seu currículo para passar no ATS de vagas de tecnologia"
- Meta Description com passo a passo para GEO
- H1: Otimizador de Currículo ATS para Vagas Tech Junior
- Footer FAQ + JSON-LD FAQ Schema para ser citado por IAs generativas

## 9. Checklist de Submissão

- [x] Aplicação publicada e abre em aba anônima
- [x] Repositório público na conta do autor
- [x] README com os 5 tópicos exigidos
- [x] PRD.md e MEGA_PROMPT.md com conteúdo
- [x] Nenhuma chave ou token versionado
- [x] Nome em minúsculas sem acento

---
Desenvolvido com Lovable + shadcn/ui + pdfjs-dist. 100% client-side.
