FROM node:16

WORKDIR /app

ADD . /app

CMD node app.js
