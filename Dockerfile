FROM node:10-alpine

WORKDIR /app

COPY package* ./

RUN npm install

EXPOSE 4200

CMD npm run start-dev
