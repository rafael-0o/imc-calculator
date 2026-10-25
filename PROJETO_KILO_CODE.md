# Briefing do projeto para o Kilo Code

Este arquivo contém apenas instruções e requisitos. O código deve ser escrito por você (Kilo Code), seguindo as especificações abaixo. Leia tudo antes de criar qualquer arquivo.

---

## 1. Contexto da atividade

- **Disciplina:** Cultura e Práticas DevOps (Centro Universitário de João Pessoa), Prof. Israel Cunha.
- **Aula de referência:** Aula 07, Construindo Esteiras (Pipelines), CI/CD.
- **Tarefa para casa:**
  1. Criar projeto no GitHub.
  2. Subir os códigos nesse projeto.
  3. Criar uma pipeline para o projeto.
  4. Executar as ações do Gitflow durante a apresentação.
  5. Apresentar a pipeline no GitHub Actions, caso seja sorteado no dia da apresentação.
- **Ideia central da aula:** simular algo real, com build, testes intermediários e deploy (publicação). Também simular **casos de exceção**: quando um estágio de teste falha, a pipeline não pode seguir para o próximo estágio.

---

## 2. Tema do projeto

**Calculadora de IMC (Índice de Massa Corporal)**: uma página web estática com lógica em JavaScript testável, publicada automaticamente no GitHub Pages por uma pipeline CI/CD.

Por que esse tema: a lógica é simples de testar, a interface é pequena e o deploy gratuito mostra um site real sendo atualizado a cada merge na `main`.

---

## 3. Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | JavaScript (Node.js 20 LTS) |
| Front-end | HTML5 + CSS + JS puro (sem framework) |
| Pacotes | npm |
| Testes unitários | Jest 29 |
| Segurança | `npm audit` com nível mínimo `high` (Snyk é opcional) |
| Lint (opcional) | ESLint |
| Repositório | GitHub |
| Fluxo de branches | Gitflow: `main`, `develop`, `feature/*` |
| Commits | Conventional Commits (`feat:`, `fix:`, `docs:`, `ci:`, `test:`) |
| CI/CD | GitHub Actions |
| Hospedagem | GitHub Pages (deploy via Actions) |
| Ambiente local | Linux, Git, Node.js 20, VS Code |

---

## 4. Estrutura de arquivos esperada

- `.github/workflows/pipeline.yml`: definição da pipeline.
- `public/index.html` e `public/style.css`: interface da calculadora.
- `src/imc.js`: lógica do cálculo e da classificação.
- `tests/imc.test.js`: testes unitários.
- `package.json` e `package-lock.json`: dependências e scripts.
- `.gitignore`: deve ignorar `node_modules/`, `dist/` e `coverage/`.
- `README.md`: documentação do projeto.

---

## 5. Requisitos de cada arquivo

### 5.1 Lógica (`src/imc.js`)

- Função que calcula o IMC a partir de peso (kg) e altura (m).
- Deve lançar erro quando peso ou altura forem zero, negativos ou não forem números.
- Função que classifica o IMC em quatro faixas: abaixo do peso (menor que 18,5), peso normal (até 24,9), sobrepeso (até 29,9) e obesidade (30 ou mais).
- **Compatibilidade dupla:** o arquivo precisa funcionar no Node (para o Jest) e no navegador (para a página). Proteja o export de módulo para que ele só ocorra quando `module` existir, caso contrário a página quebra no GitHub Pages.
- Para a demonstração de Gitflow, a função de classificação pode ser deixada de fora da primeira versão e implementada depois na branch `feature/classificacao-imc`. Se preferir, comece completo e escolha outra feature para a demonstração.

### 5.2 Testes (`tests/imc.test.js`)

Cobrir no mínimo:
- Cálculo correto do IMC (exemplo: 70 kg e 1,75 m resultam em cerca de 22,86).
- Erro para peso zero, peso negativo, altura zero e tipos inválidos.
- Classificação nas quatro faixas, incluindo valores de fronteira (se a classificação estiver implementada).
- Usar comparação aproximada para números decimais.

### 5.3 Interface (`public/index.html` e `public/style.css`)

- Título da página, campo de peso, campo de altura e botão "Calcular".
- Área de resultado com o IMC em 2 casas decimais e a classificação.
- Tratamento de erro: valores inválidos mostram mensagem na tela, sem quebrar a página.
- O script da lógica deve ser carregado por caminho relativo (`imc.js`), pois o build copia `src/imc.js` para a pasta `dist/` junto com os arquivos de `public/`.
- Visual limpo e responsivo (funciona bem no celular).

### 5.4 `package.json`

- Nome, versão e descrição do projeto.
- Script `build`: cria a pasta `dist/`, copia o conteúdo de `public/` e copia `src/imc.js` para dentro dela.
- Script `test`: executa o Jest.
- Jest 29 como única dependência de desenvolvimento.
- Rodar `npm install` para gerar o `package-lock.json` e **commitá-lo**, pois a pipeline usa `npm ci`, que exige o lockfile.

### 5.5 Pipeline (`.github/workflows/pipeline.yml`)

**Gatilhos:**
- Push nas branches `main` e `develop`.
- Pull requests para `main` e `develop`.

**Variável de ambiente:** definir a versão do Node (20) em `env:` no topo e reutilizar nos jobs. Isso corresponde ao conteúdo de variáveis da aula.

**Jobs, nesta ordem lógica:**
1. **build:** faz checkout, configura Node 20 com cache do npm, instala dependências com `npm ci`, roda `npm run build` e publica a pasta `dist/` como artefato.
2. **test** (depende de build): checkout, setup do Node, `npm ci`, `npm test`.
3. **security** (depende de build, roda em paralelo com test): checkout, setup do Node, `npm ci`, `npm audit` com nível mínimo `high`.
4. **deploy** (depende de test e security): baixa o artefato `dist`, configura o Pages, envia o artefato do Pages e faz o deploy.

**Regras obrigatórias:**
- O deploy só roda em **push na `main`** (nunca em pull request, nunca em `develop`).
- O deploy só roda se `test` **e** `security` passarem.
- Se `test` falhar, o `deploy` deve aparecer como **skipped**. Esse é o caso de exceção que o professor quer ver.
- O job de deploy precisa das permissões `pages: write` e `id-token: write`, do ambiente `github-pages` e de expor a URL final do site.
- Usar versões atuais e estáveis das actions oficiais (`checkout`, `setup-node`, `upload-artifact`, `download-artifact`, `configure-pages`, `upload-pages-artifact`, `deploy-pages`).

### 5.6 `README.md`

Seguir este padrão:
- Um único `#` como título, com o nome claro do projeto.
- Descrição curta (máximo 3 linhas).
- Pré-requisitos (ferramentas, linguagens e versões).
- Instalação passo a passo, com comandos exatos de terminal em blocos de código.
- Exemplos de uso mostrando como rodar e interagir (rodar testes, rodar build, abrir a página).
- Extras úteis: badge de status da pipeline, link do site publicado, resumo do fluxo Gitflow e um diagrama simples das etapas da pipeline.

---

## 6. Passos manuais (o usuário faz, o Kilo Code não)

1. Criar o repositório vazio no GitHub, sem README inicial, para evitar conflito no primeiro push.
2. Gerar a chave SSH (RSA 4096 bits, com o e-mail do GitHub), copiar a chave pública, cadastrá-la em GitHub → Settings → SSH and GPG keys e testar a conexão com o GitHub.
3. Habilitar o Pages em **Settings → Pages → Source: GitHub Actions**.
4. (Opcional) Proteger a `main` em **Settings → Branches**, exigindo Pull Request e os status checks `test` e `security`.
5. Configurar o Git local com nome, e-mail e branch inicial padrão `main`.

---

## 7. Roteiro Gitflow para a apresentação

1. Inicializar o repositório local, adicionar o remote do GitHub, fazer o primeiro commit (`feat: projeto inicial com pipeline CI/CD`) e dar push na `main`.
2. Criar a branch `develop` a partir da `main` e enviar ao GitHub.
3. Criar a branch `feature/classificacao-imc` a partir da `develop`, implementar a feature com testes, commitar e dar push.
4. Abrir Pull Request da feature para `develop` e fazer o merge.
5. Abrir Pull Request da `develop` para a `main` e fazer o merge, o que dispara o deploy.

Comandos úteis para mostrar durante a apresentação: `git status`, `git log --oneline --graph --all`, `git remote -v` e `git pull origin main`.

---

## 8. Demonstração do caso de falha (obrigatória)

1. Criar a branch `feature/bug-proposital` a partir da `develop`.
2. Quebrar a função de cálculo de propósito (por exemplo, trocando a divisão por uma multiplicação).
3. Dar push e abrir Pull Request: mostrar o job `test` **vermelho** e o `deploy` **pulado**.
4. Corrigir o erro e dar push novamente: mostrar a pipeline **verde**.
5. Fazer o merge na `main` e mostrar o site atualizado no GitHub Pages.

---

## 9. Critérios de conclusão (checklist)

- [ ] Repositório criado no GitHub com o código enviado.
- [ ] `npm ci`, `npm run build` e `npm test` funcionam localmente sem erro.
- [ ] Workflow com os jobs build, test, security e deploy.
- [ ] Pipeline verde na `main` e site publicado no GitHub Pages.
- [ ] Branches `main`, `develop` e pelo menos uma `feature/*` criadas.
- [ ] Pelo menos um Pull Request com merge feito.
- [ ] Falha proposital demonstrada, com o deploy bloqueado.
- [ ] README completo no padrão definido, com badge.
- [ ] Aba **Actions** com histórico de execuções para mostrar ao professor.

---

## 10. Itens opcionais (só se sobrar tempo)

- ESLint como job extra de lint antes dos testes.
- Snyk no lugar do `npm audit` (exige o secret `SNYK_TOKEN` em Settings → Secrets and variables → Actions).
- Cypress ou Playwright para um teste de aceitação da página.
- Dockerfile e publicação da imagem no `ghcr.io`.
- Prometheus e Grafana: apenas mencionar na apresentação, são pesados demais para este projeto.

---

## 11. Instruções para o agente (Kilo Code)

- Responder e comentar o código em **português do Brasil**.
- Manter o projeto **simples**: sem frameworks e sem dependências além do Jest.
- Não alterar a estrutura de pastas nem os nomes dos jobs sem avisar.
- Garantir que `src/imc.js` funcione no Node e no navegador.
- Gerar e commitar o `package-lock.json`.
- Após criar os arquivos, rodar `npm install`, `npm test` e `npm run build` e confirmar que tudo passa antes de finalizar.
- Não executar `git push` nem criar o repositório remoto; esses passos são manuais do usuário.
- Ao terminar, listar os arquivos criados e quais passos manuais da seção 6 ainda faltam.
