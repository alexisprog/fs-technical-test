FROM node:20-alpine

WORKDIR /app

# Copiar archivos de proyecto
COPY package*.json ./

# Instalar dependencias
RUN yarn install

# Copiar el resto de los archivos
COPY . .

EXPOSE 3000

CMD ["yarn", "dev"] 