FROM node:24.19.0-bookworm-slim AS build
WORKDIR /workspace
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run ci
RUN npm prune --omit=dev

FROM node:24.19.0-bookworm-slim AS cli
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /workspace/package.json ./
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/dist ./dist
COPY --from=build /workspace/vectors ./vectors
COPY --from=build /workspace/fixtures ./fixtures
ENTRYPOINT ["node", "dist/cli.js"]
