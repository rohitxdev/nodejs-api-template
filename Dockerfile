FROM node:20-alpine3.17

WORKDIR /app

COPY package.json .

COPY pnpm-lock.yaml .

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 443

CMD node ./dist/index.js

