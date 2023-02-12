FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV TRANSPORTER=nats://10.0.1.4:4222
ENV CHAT_DB_URI=mongodb+srv://sudo:sudo@chat-db.ho7c1t6.mongodb.net/?retryWrites=true&w=majority

RUN npm install

COPY . .

CMD ["npm", "start"]
