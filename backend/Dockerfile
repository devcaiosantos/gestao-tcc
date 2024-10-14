# Usando uma imagem oficial do Node.js como base
FROM node:20.18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instalar as dependências usando Yarn
RUN yarn install --production

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta que o backend usará
EXPOSE 5000

# Comando para rodar a aplicação
CMD ["yarn", "start:prod"]