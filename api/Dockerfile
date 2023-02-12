FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV PORT=80
ENV TRANSPORTER=nats://10.0.1.4:4222

RUN npm install

COPY . .

CMD ["npm", "start"]
