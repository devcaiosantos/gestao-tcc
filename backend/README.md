# 🛠 Guia de Instalação e Configuração do Backend

Este documento fornece um passo a passo para instalar e configurar o backend do projeto **Gestão TCC**.

## 📌 Pré-requisitos
Antes de iniciar a instalação, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (ou outro banco de dados compatível)
- [Docker](https://www.docker.com/) (opcional, para execução em container)

## 🚀 Instalação
Siga os passos abaixo para instalar o backend:

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/devcaiosantos/gestao-tcc.git
cd gestao-tcc/backend
```

### 2️⃣ Instale as dependências
Com npm:
```bash
npm install
```
Ou com Yarn:
```bash
yarn install
```

## ⚙️ Configuração
As variáveis de ambiente estão definidas no arquivo `.env.example`. Para configurá-las, copie este arquivo e renomeie para `.env`:
```bash
cp .env.example .env
```
Altere os valores de variáveis de acordo com seu ambiente.
Certifique-se de que o PostgreSQL está rodando e configurado corretamente.

### 3️⃣ Executar as migrações do Prisma
Antes de iniciar o backend, execute as migrações para configurar o banco de dados:
```bash
npx prisma migrate dev
```
Ou, para produção:
```bash
npx prisma migrate deploy
```

## ▶️ Executando o Backend
Para rodar o backend em ambiente de desenvolvimento:
```bash
npm run start:dev  # ou yarn start:dev
```
O backend estará disponível em `http://localhost:5000`.

## 🏗 Build para Produção
Para gerar uma build otimizada:
```bash
npm run build  # ou yarn build
```
E para iniciar a aplicação em produção:
```bash
npm start  # ou yarn start
```

## 🔐 Configuração do Administrador
O administrador é o usuário principal do sistema e deve ser criado manualmente via API.

1. Acesse a documentação Swagger em:
   ```plaintext
   http://localhost:5000/docs
   ```
2. Utilize a rota `POST /api/administrador` para criar um novo administrador.
3. Após uma requisição bem-sucedida, você poderá acessar o sistema com esse usuário.

Agora o backend do **Gestão TCC** está pronto para uso! 🚀

## 📌 Configuração Pós-Login

Após acessar o sistema pela primeira vez, algumas configurações adicionais são essenciais para o funcionamento completo:

### 📧 Configuração do E-mail do Sistema
O e-mail do sistema é utilizado para envios massivos a alunos e orientadores. Para configurá-lo, siga as instruções detalhadas no guia abaixo:

📄 [Configuração do E-mail do Sistema](./config-email-key.md)

### 📅 Configuração da API do Google Calendar
A integração com o Google Calendar é necessária para o agendamento da banca. Para configurar, siga o tutorial:

📄 [Configuração da API do Google Calendar](./CALENDAR_API_CONFIG.md)

Agora o backend do **Gestão TCC** está pronto para uso! 🚀


