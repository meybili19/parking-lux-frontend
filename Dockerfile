# 🔹 Etapa 1: Construcción de la aplicación Next.js
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias
RUN npm install

# Copiar solo los archivos necesarios
COPY ./components ./components
COPY ./pages ./pages
COPY ./public ./public
COPY ./src ./src

# Omitir ESLint en producción (evita errores)
ENV NEXT_DISABLE_ESLINT=1

# Asegurar que Node.js reconozca Next.js correctamente
ENV NODE_OPTIONS="--max_old_space_size=512"

# Construir la aplicación Next.js
RUN npm run build

# ---------------------------------------------------

# 🔹 Etapa 2: Servidor de producción para Next.js
FROM node:18-alpine AS runner

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar solo los archivos necesarios desde la fase de construcción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Exponer el puerto donde correrá la app
EXPOSE 3000

# Establecer la variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar el servidor Next.js
CMD ["npm", "run", "start"]
