FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]