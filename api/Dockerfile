FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY package-lock.json ./

RUN npm install --only=production

CMD ["node", "dist/index.js"]