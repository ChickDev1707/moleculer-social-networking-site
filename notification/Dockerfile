FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

ENV MAILER_API_KEY=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
ENV MAILER_SENDER=thuancoixy234786@gmail.com
ENV MAILER_VALIDATION_API_KEY=3e25cf1c0fbd4fb3b1ce48974d538818
ENV MAILER_USER=19522318@gm.uit.edu.vn
ENV MAILER_PASSWORD=1453087464
ENV TRANSPORTER=nats://10.0.1.4:4222 
ENV ROOT_DOMAIN=http://localhost:3000
ENV NOTIFICATION_DB_URI=mongodb+srv://sudo:sudo@notification-db.xqig3qi.mongodb.net/?retryWrites=true&w=majority

RUN npm install

COPY . .

CMD ["npm", "start"]
