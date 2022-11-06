FROM node:16

WORKDIR /app

RUN npm install --production

ADD . /app

CMD node app.js
