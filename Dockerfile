FROM node:12-alpine as builder

ENV NODE_ENV build

USER root
WORKDIR /home/node

COPY . /home/node
RUN chmod 755 /home/node/

RUN npm ci \
    && npm run build

# ---

FROM node:12-alpine as production

ENV NODE_ENV production

USER root
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/
RUN chmod 755 /home/node/

RUN npm ci

CMD ["node", "dist/server.js"]