FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Copy migration SQL files into dist so the compiled migrate script can find them
RUN cp -r db/drizzle-migrations dist/db/drizzle-migrations

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node dist/scripts/migrate.js && node dist/server.js"]
