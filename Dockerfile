FROM node:12-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM node:12-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build 
COPY --from=builder /app/locales ./locales

ENTRYPOINT ["node"]
CMD ["/app/build/index.js"] 
