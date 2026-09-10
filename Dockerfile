# Dockerfile para subir no seu servidor com Node.js 22 Alpine (multi-stage)
# Build leve e compatível com as versões mais recentes das dependências

# Estágio 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# Estágio 2: Execução leve
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copia os arquivos compilados da aplicação cliente e do server.cjs
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
