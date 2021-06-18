FROM node:latest

COPY package-lock.json package.json ./
RUN npm install
COPY . .

ENV DATABASE_MONGO_URI ${DATABASE_MONGO_URI}

CMD ["npm", "run", "start"]