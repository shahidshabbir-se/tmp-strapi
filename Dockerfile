# Build stage
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash vips-dev git > /dev/null 2>&1
WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm ci
ENV NODE_ENV=production
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/
COPY --from=build /opt/ ./
EXPOSE 1337
CMD ["npm", "run", "start"]
