FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/user-service ./services/user-service

WORKDIR /app/services/user-service

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 4102

CMD ["npm", "start"]
