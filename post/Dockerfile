FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV TRANSPORTER=nats://10.0.1.4:4222
ENV POST_DB_URI=mongodb+srv://sudo:sudo@post-db.ykqj3f7.mongodb.net/?retryWrites=true&w=majority

RUN npm install

COPY . .

CMD ["npm", "start"]
