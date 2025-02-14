# 🔹 Etapa 1: Construcción de Next.js
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias sin archivos innecesarios
RUN npm install --frozen-lockfile

# Copiar todo el código fuente necesario
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# 🔹 Etapa 2: Producción (Ejecutar Next.js de manera eficiente)
FROM node:18-alpine AS runner

# Establecer el directorio de trabajo en producción
WORKDIR /app

# Copiar el código construido en la primera etapa
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copiar también next.config.js porque a veces se necesita en producción
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Exponer el puerto 3000
EXPOSE 3000

# Definir comando para iniciar el servidor
CMD ["npm", "run", "start"]
