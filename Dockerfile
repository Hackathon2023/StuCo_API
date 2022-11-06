FROM node:16

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules && rm -rf package-lock.json && npm 

COPY . .
EXPOSE 8080
CMD ["node", "app.js"]
