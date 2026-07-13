FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/product-service ./services/product-service

WORKDIR /app/services/product-service

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 4103

CMD ["npm", "start"]
