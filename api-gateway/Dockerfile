FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY api-gateway ./api-gateway

WORKDIR /app/api-gateway

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 4000

CMD ["npm", "start"]
