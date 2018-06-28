FROM node:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get -y install autoconf automake libtool nasm make pkg-config git apt-utils

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN mkdir /usr/src/app/node_modules
COPY . /usr/src/app

ENV NODE_ENV production
ENV PORT 3000

CMD ["npm", "run", "build"]
