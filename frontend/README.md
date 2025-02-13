# 🛠 Guia de Instalação e Configuração do Frontend

Este documento fornece um passo a passo para instalar e configurar o frontend do projeto **Gestão TCC**.

## 📌 Pré-requisitos
Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão recomendada: 18 ou superior)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

## 🚀 Instalação
Siga os passos abaixo para instalar o frontend:

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/devcaiosantos/gestao-tcc.git
cd gestao-tcc/frontend
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
As variáveis de ambiente necessárias estão no arquivo `.env.example`. Para configurá-las, copie este arquivo e renomeie para `.env.local`:
```bash
cp .env.example .env.local
```
Atualmente, a única variável utilizada é:
```plaintext
NEXT_PUBLIC_API_URL=<URL_DO_BACKEND>
```
Substitua `<URL_DO_BACKEND>` pelo endereço do backend.

## ▶️ Executando o Projeto
Para rodar o frontend em ambiente de desenvolvimento:

Com npm:
```bash
npm run dev
```
Com Yarn:
```bash
yarn dev
```
O frontend estará disponível em `http://localhost:3000`.

## 🏗 Build para Produção
Para gerar uma build otimizada:

Com npm:
```bash
npm run build
```
Com Yarn:
```bash
yarn build
```
E para rodar a aplicação em modo de produção:
```bash
npm start  # ou yarn start
```

---
Agora o frontend do **Gestão TCC** está pronto para uso! 🚀

