# 🔹 Etapa 1: Construcción de la aplicación Next.js
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos esenciales
COPY package.json package-lock.json ./

# Instalar todas las dependencias
RUN npm install

# Copiar archivos de la aplicación
COPY ./public ./public
COPY ./src/styles ./src/styles 
COPY ./src ./src
COPY ./pages ./pages
COPY ./components ./components

# Desactivar ESLint en producción
ENV NEXT_DISABLE_ESLINT=1
ENV NEXT_PUBLIC_GENERATE_STATIC=false

# Construir la aplicación
RUN npm run build || exit 0

# 🔹 Etapa 2: Servidor de producción
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar solo los archivos necesarios desde la fase de construcción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/styles ./src/styles
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto
EXPOSE 3000

# Establecer variable de entorno
ENV NODE_ENV=production

# Iniciar el servidor
CMD ["npm", "run", "start"]
