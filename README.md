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
2. No Render, crie um Web Service usando Docker.
3. Se o repositorio estiver com as pastas `backend` e `frontend`, preencha `Root Directory` com `backend`.
4. Configure as variaveis de ambiente:

```
DATABASE_URL=jdbc:postgresql://HOST:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=sua_senha_do_supabase
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://seu-frontend.vercel.app
JPA_SHOW_SQL=false
```

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
