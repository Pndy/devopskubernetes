FROM node:alpine AS builder
WORKDIR /app
COPY . .
RUN npm i && npm run build --production

FROM node:alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]