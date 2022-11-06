FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm clear cache && rm -rf node_modules && rm -rf package-lock.json && npm i

COPY . .
EXPOSE 8080
CMD ["node", "app.js"]
