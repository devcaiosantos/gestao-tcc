# Usando uma imagem do Node.js como base
FROM node:20.18 as builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e yarn.lock para instalar as dependências
COPY package.json yarn.lock ./

# Instalar as dependências usando Yarn
RUN yarn install

# Copiar o restante do código da aplicação
COPY . .

# Build da aplicação
RUN yarn build

# Usar uma imagem de servidor web (nginx) para servir o build estático
FROM nginx:alpine

# Copiar o build para o diretório padrão do nginx
COPY --from=builder /app/.next /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

# Copiar um arquivo de configuração Nginx personalizado, se necessário
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta que o nginx usará
EXPOSE 80

# Comando padrão do Nginx
CMD ["nginx", "-g", "daemon off;"]
