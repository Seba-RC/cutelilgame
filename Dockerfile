FROM node:18-alpine
WORKDIR /app

ENV HOST=0.0.0.0

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]