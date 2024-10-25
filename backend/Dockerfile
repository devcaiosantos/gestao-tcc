FROM node:20.18 AS builder

WORKDIR /usr/src/api 

COPY . .
COPY ./.env.production ./.env

RUN yarn install --silent --ignore-optional

RUN yarn build

CMD ["yarn", "start"]