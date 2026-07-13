FROM node:20-alpine

WORKDIR /app

COPY shared ./shared
COPY services/auth-service ./services/auth-service

WORKDIR /app/services/auth-service

RUN npm install --omit=dev

ENV NODE_ENV=production
EXPOSE 4101

CMD ["npm", "start"]
