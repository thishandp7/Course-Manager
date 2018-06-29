FROM node:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get -y install autoconf automake libtool nasm make pkg-config git apt-utils

RUN mkdir -p /app
WORKDIR /app

COPY . /app

CMD ["npm", "run", "builder", "--noinput"]
