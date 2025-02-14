# 🔹 Etapa 1: Construcción de la aplicación Next.js
FROM node:18-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos esenciales para instalar dependencias
COPY package.json package-lock.json ./

# Instalar TODAS las dependencias
RUN npm install

# Copiar directorios clave antes de todo el código
COPY ./components ./components
COPY ./pages ./pages

# Copiar el resto del código fuente
COPY . .

# Omitir ESLint en producción (evita errores)
ENV NEXT_DISABLE_ESLINT=1

# Construir la aplicación Next.js
RUN npm run build
