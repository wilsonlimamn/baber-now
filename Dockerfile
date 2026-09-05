# Dockerfile para subir no seu servidor com Node.js 20 Alpine (multi-stage)
# Build idêntico ao padrão dos seus outros contêineres

# Estágio 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Execução leve
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

# Copia os arquivos compilados da aplicação cliente e do server.cjs
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
