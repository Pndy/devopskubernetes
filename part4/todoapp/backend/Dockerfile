FROM node:lts-alpine3.14

WORKDIR /usr/src/app

COPY . .

RUN npm i && mkdir public

EXPOSE 3000

CMD ["node", "index.js"]