# Uso la imagen oficial de Node.js 
FROM node:lts

# Elegimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copio los archivos de dependencias primero para aprovechar la cache de Docker
COPY package*.json ./

# Instalo las dependencias del proyecto
RUN npm install

# Copio el resto del código fuente al contenedor
COPY . .

# Compilo el proyecto NestJS
RUN npm run build

# Expongo el puerto 3000 para que el contenedor escuche en ese puerto
EXPOSE 3000

# Comando que se ejecuta al arrancar el contenedor
CMD ["npm", "run", "start:prod"]





