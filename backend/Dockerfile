
FROM node:18-alpine
WORKDIR  "/vacations/backend/"
RUN npm install -g npm@9.1.1
RUN npm i -g ts-node
RUN npm i -g nodemon
# RUN npm config set http-proxy http://<my company proxy>:8099
# RUN npm config set https-proxy http://<my company proxy>:8099


COPY package.json /vacations/backend/
COPY package-lock.json /vacations/backend/
RUN npm install
EXPOSE 8080
COPY ./ ./
ENTRYPOINT npm start
