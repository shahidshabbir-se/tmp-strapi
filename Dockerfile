
# Build stage
FROM node:22-alpine AS build

RUN apk add --no-cache \
  build-base \
  gcc \
  autoconf \
  automake \
  zlib-dev \
  libpng-dev \
  vips-dev \
  git \
  python3 \
  make

WORKDIR /opt/app

COPY package.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

# Production stage
FROM node:22-alpine AS production

RUN apk add --no-cache vips

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

WORKDIR /opt/app

COPY --from=build /opt/app ./

EXPOSE 1337

CMD ["npm", "run", "start"]
