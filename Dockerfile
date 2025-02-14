# Etapa 1: Construcción de Next.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json antes para aprovechar la caché de Docker
COPY package.json package-lock.json ./
RUN npm install

# Copiar toda la aplicación para la compilación
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar la carpeta compilada de Next.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Exponer puerto
EXPOSE 3000

# Iniciar Next.js en producción
CMD ["npm", "run", "start"]
