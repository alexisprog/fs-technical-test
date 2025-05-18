FROM node:20-alpine

WORKDIR /app

# Instalar dependencias esenciales para compilación de módulos nativos
RUN apk add --no-cache python3 make g++ bash git

# Copiar archivos del proyecto
COPY package.json ./

# Instalar dependencias con yarn
RUN yarn install

# Instalar dependencias adicionales necesarias
RUN yarn add ts-morph@20.0.0 @nestjs/apollo@12.0.11 @nestjs/graphql@12.0.11 @nestjs/axios axios @nestjs/schedule

# Copiar el resto de los archivos
COPY . .

# Compilar la aplicación
RUN yarn build

EXPOSE 4000

CMD ["yarn", "dev"] 