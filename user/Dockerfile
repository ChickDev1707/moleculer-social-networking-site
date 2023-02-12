FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV TRANSPORTER=nats://10.0.1.4:4222
ENV ROOT_DOMAIN=http://20.2.69.210
ENV USER_DB_URI=neo4j+s://f7b2dac2.databases.neo4j.io
ENV USER_DB_USERNAME=neo4j
ENV USER_DB_PASSWORD=chickdev1707
ENV ACCESS_TOKEN_SECRET=IwhPuSTi9E
ENV REFRESH_TOKEN_SECRET=u2iUE4MHwj

RUN npm install

COPY . .

CMD ["npm", "start"]
