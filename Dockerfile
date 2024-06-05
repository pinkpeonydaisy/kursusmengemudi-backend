FROM node:19.2.0-alpine AS build

ENV NODE_OPTIONS=--max_old_space-size=512

WORKDIR /srv

COPY package*.json /srv/

RUN npm ci && npm i -g typescript husky eslint

COPY tsconfig.json /srv/

COPY src /srv/src/

COPY index.d.ts /srv/

RUN tsc

RUN npm ci --production

FROM alpine:latest

RUN apk add nodejs --no-cache

WORKDIR /app

COPY --from=build /srv/node_modules /app/node_modules

COPY --from=build /srv/build /app/build

CMD ["node", "build/index.js"]