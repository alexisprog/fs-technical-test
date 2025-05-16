FROM node:20-alpine

WORKDIR /app

# Instalar dependencias esenciales
RUN apk add --no-cache python3 make g++

# Copiar archivos de proyecto
COPY package*.json ./

# Instalar dependencias
RUN yarn install

# Copiar el resto de los archivos
COPY . .

EXPOSE 4000

CMD ["yarn", "dev"] 