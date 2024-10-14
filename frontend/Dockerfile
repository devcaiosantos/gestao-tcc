# Usando uma imagem do Node.js como base
FROM node:20.18

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instalar as dependências usando Yarn
RUN yarn install

# Copiar o restante do código da aplicação
COPY . .

# Build da aplicação (para Next.js use 'next build' em vez de 'yarn build')
RUN yarn build

# Usar uma imagem de servidor web (nginx) para servir o build estático
FROM nginx:alpine

# Copiar o build para o diretório padrão do nginx (para aplicações Next.js, o build está em .next ou out)
COPY --from=0 /app/.next /usr/share/nginx/html

# Expor a porta que o nginx usará
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]
