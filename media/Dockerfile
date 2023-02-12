FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV TRANSPORTER=nats://10.0.1.4:4222
ENV MEDIA_HOST=20.205.136.13
ENV MEDIA_ACCESS_KEY=minioadmin
ENV MEDIA_SECRET_KEY=minioadmin

RUN npm install

COPY . .

CMD ["npm", "start"]
