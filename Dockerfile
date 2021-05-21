FROM node:latest

COPY . .
RUN npm install
CMD ["nodemon", "app/app.js"]