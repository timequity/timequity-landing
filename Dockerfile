FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
ENV ASTRO_DATABASE_FILE=/data/baseline.db
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV ASTRO_DATABASE_FILE=/data/baseline.db
RUN mkdir -p /data
COPY --from=build /app/dist ./dist
COPY --from=build /app/.astro ./.astro
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/scripts ./scripts
COPY package.json ./package.json
EXPOSE 3000
CMD ["node", "./scripts/start.mjs"]
