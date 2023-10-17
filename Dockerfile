FROM node:20-alpine3.17

WORKDIR /app

COPY package.json .

COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

EXPOSE 443

CMD node ./dist/index.js

