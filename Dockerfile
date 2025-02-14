# Etapa 1: Construcción de Next.js
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Copiar la carpeta src completa para evitar problemas
COPY ./src/styles ./src/styles
COPY ./src/services ./src/services
COPY ./public ./public
COPY ./pages ./pages
COPY ./components ./components

# Construir la aplicación
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "run", "start"]
