# Avaliacao Biblioteca

Sistema de biblioteca com backend Spring Boot, frontend React/Vite e configuracao pronta para deploy.

## Como rodar

### Banco de dados (Postgres via Docker)
```
cd backend
docker compose up -d
```

### Backend (Spring Boot + Gradle + Java 25)
```
cd backend
./gradlew bootRun
```
(ou importe a pasta `backend` como projeto Gradle na sua IDE e rode a classe `BibliotecaApplication`)

A API sobe em `http://localhost:8080`.

### Frontend (React + Vite)
```
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Deploy

### Backend no Render

Este projeto ja esta preparado para deploy com Docker.

1. Suba o repositorio para o GitHub.
2. No Supabase, crie um projeto e copie a string em `Project Settings > Database > Connect > JDBC`.
3. No Render, crie um Web Service usando Docker.
4. Se o repositorio estiver com as pastas `backend` e `frontend`, preencha `Root Directory` com `backend`.
5. Configure as variaveis de ambiente:

```
SUPABASE_DB_URL=jdbc:postgresql://aws-REGIAO.pooler.supabase.com:5432/postgres?user=postgres.PROJECT_REF&password=SUA_SENHA&sslmode=require
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://seu-frontend.vercel.app
JPA_SHOW_SQL=false
DB_MAX_POOL_SIZE=5
DB_MIN_IDLE=1
```

Se preferir usar a conexao separada em host/usuario/senha, remova `SUPABASE_DB_URL` e configure:

```
DATABASE_URL=jdbc:postgresql://HOST:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres.PROJECT_REF
DATABASE_PASSWORD=SUA_SENHA
```

Para deploy em Render, o pooler do Supabase em Session mode costuma ser a opcao mais simples, porque a conexao direta pode depender de IPv6.

### Frontend na Vercel

1. Importe o repositorio na Vercel.
2. Selecione `frontend` como Root Directory.
3. Configure a variavel:

```
VITE_API_URL=https://seu-backend.onrender.com
```

Depois de publicar o frontend, volte no Render e inclua a URL da Vercel em `CORS_ALLOWED_ORIGINS`.

## Atividade

Este sistema tem bugs propositais no backend e no frontend, além de pontos que podem
ser melhorados (boas práticas, validações, tratamento de erro, etc). Naveguem pelas telas,
testem os fluxos (cadastrar livro, emprestar, devolver) e façam uma lista do que encontrarem.
