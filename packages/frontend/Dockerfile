FROM node:20-alpine

WORKDIR /app

# Instalar dependencias esenciales para compilación
RUN apk add --no-cache python3 make g++ bash git

# Copiar archivos del proyecto
COPY package.json ./

# Instalar dependencias
RUN yarn install

# Copiar el resto de los archivos
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"] 