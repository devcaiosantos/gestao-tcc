# Usando uma imagem oficial do Node.js como base
FROM node:20.18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instalar as dependências usando Yarn
RUN yarn install

# Instalar o Nest CLI globalmente
RUN yarn global add @nestjs/cli

# Copiar o restante do código da aplicação
COPY . .

# Executar migrações do Prisma (isso assume que você já configurou suas migrações)
RUN npx prisma migrate deploy

# Gerar o cliente Prisma (após aplicar as migrações)
RUN npx prisma generate

# Compilar o código NestJS
RUN yarn build

# Verifique se o diretório dist/ foi gerado
RUN ls dist/

# Remover as dependências de desenvolvimento (opcional para imagem menor)
RUN yarn install --production --frozen-lockfile

# Expor a porta que o backend usará
EXPOSE 5000

# Comando para rodar a aplicação, aguardando o banco de dados
CMD ["yarn", "start:prod"]
