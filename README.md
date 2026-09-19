# Workshop de Empreendedorismo

Projeto em **Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL**.

## O que funciona

- Página pública do workshop
- Formulário de inscrição
- Validação de CPF
- Um CPF só pode se inscrever uma vez
- Escolha de turno: manhã, noite ou ambos
- Avisos do evento vindos do banco PostgreSQL
- Área do organizador com login
- Lista e filtros de inscritos
- Exportação dos inscritos em CSV
- Criação e exclusão de avisos

## 1. Programas necessários

Instale no Windows:

- Node.js 22 LTS (ou versão mais nova compatível)
- VS Code
- Docker Desktop (maneira mais fácil de rodar o PostgreSQL)

Se você já tem PostgreSQL instalado diretamente no Windows, o Docker é opcional.

## 2. Abrir no VS Code

Extraia o ZIP e abra a pasta `workshop-empreendedorismo` no VS Code.

No terminal do VS Code:

```bash
npm install
```

## 3. Subir o PostgreSQL com Docker

Com o Docker Desktop aberto, rode:

```bash
docker compose up -d
```

O projeto já vem configurado com:

- host: `localhost`
- porta: `5432`
- banco: `workshop`
- usuário: `workshop`
- senha: `workshop123`

A conexão usada no `.env` é:

```env
DATABASE_URL="postgresql://workshop:workshop123@localhost:5432/workshop?schema=public"
```

## 4. Criar as tabelas e o usuário administrador

Rode:

```bash
npm run db:setup
```

Esse comando gera o Prisma Client, cria/sincroniza as tabelas no PostgreSQL e executa o seed do administrador.

Credenciais locais incluídas no `.env`:

```text
E-mail: organizador@escola.com
Senha: admin123456
```

Troque essas credenciais antes de publicar o site na internet.

## 5. Rodar o site

```bash
npm run dev
```

Abra no navegador:

```text
http://localhost:3000
```

Área do organizador:

```text
http://localhost:3000/admin/login
```

## Comandos úteis

```bash
npm run dev             # servidor de desenvolvimento
npm run build           # cria versão de produção
npm run start           # roda versão de produção
npm run db:setup        # prepara o banco pela primeira vez
npm run db:push         # sincroniza schema.prisma com o banco
npm run prisma:generate # gera Prisma Client
npm run prisma:seed     # recria/atualiza usuário administrador
npm run db:studio       # abre Prisma Studio
```

## Se você já instalou PostgreSQL no Windows

Você pode ignorar o Docker. Crie um banco chamado `workshop` e altere o `.env` com seu usuário e sua senha:

```env
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/workshop?schema=public"
```

Depois execute:

```bash
npm install
npm run db:setup
npm run dev
```

## Arquivos que você normalmente vai editar

- `src/app/page.tsx` — página inicial
- `src/lib/event.ts` — nome, descrição, data, local e imagem do evento
- `src/app/globals.css` — visual do site
- `prisma/schema.prisma` — estrutura do banco
- `.env` — conexão PostgreSQL, segredo e login do administrador

## Produção

Não publique o `.env` no GitHub. Em produção, use uma senha forte para o administrador, gere outro `AUTH_SECRET` e configure uma `DATABASE_URL` do PostgreSQL de produção.
