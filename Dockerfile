FROM node:16

WORKDIR /app

RUN npm install

ADD . /app

CMD node app.js
