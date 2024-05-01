FROM node:21-alpine

USER root

# Update packages as a result of Anchore security vulnerability checks
RUN apk update --no-cache && \
    apk upgrade --no-cache && \
    apk add --no-cache gnutls binutils nodejs npm apk-tools libjpeg-turbo libcurl libx11 libxml2

# Setup nodejs group & nodejs user
RUN addgroup --system nodejs --gid 998 && \
    adduser --system nodejs --uid 999 --home /app/ && \
    chown -R 999:998 /app/

USER 999

WORKDIR /app

# Copy dir
COPY --chown=999:998 . ./

# Install deps
RUN yarn install \
  --frozen-lockfile \
  --production=true

# Build
RUN yarn run build

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE ${PORT}

CMD [ "node", ".output/server/index.mjs" ]
