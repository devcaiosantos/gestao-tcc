# Etapa de build
FROM node:20.18 AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/api

# Copia o código-fonte e o arquivo de ambiente de produção
COPY . .
COPY ./.env.production ./.env

# Instala as dependências
RUN yarn install --silent --ignore-optional

# Realiza o build da aplicação
RUN yarn build

# Expondo a porta que será utilizada
EXPOSE 5000

# Comando para aplicar as migrações e iniciar o servidor
CMD ["sh", "-c", "yarn prisma migrate deploy && yarn start"]
