
FROM node:22-alpine AS build

RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  gcc \
  build-base \
  vips-dev \
  zlib-dev \
  libpng-dev

WORKDIR /opt/app

COPY package.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache vips

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

WORKDIR /opt/app

COPY --from=build /opt/app ./

EXPOSE 1337

CMD ["npm", "run", "start"]
