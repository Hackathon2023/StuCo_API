FROM node:16

WORKDIR /

RUN npm install

CMD node app.js
