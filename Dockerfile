FROM node:latest

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
COPY . .
CMD ["node", "app.js"]