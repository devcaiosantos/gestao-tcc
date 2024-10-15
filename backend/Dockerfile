# Usando uma imagem oficial do Node.js como base
FROM node:20.18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instalar as dependências usando Yarn (incluindo dependências de desenvolvimento para compilar)
RUN yarn install

# Instalar o Nest CLI globalmente
RUN yarn global add @nestjs/cli

# Copiar o restante do código da aplicação
COPY . .

# Gerar o cliente Prisma (necessário para o build)
RUN npx prisma generate

# Compilar o código NestJS
RUN yarn build

# Remover as dependências de desenvolvimento (se quiser manter a imagem menor)
RUN yarn install --production --frozen-lockfile

# Expor a porta que o backend usará
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["yarn", "start:prod"]
