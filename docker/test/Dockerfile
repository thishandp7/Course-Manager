FROM node:latest

USER root

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get -y install autoconf automake libtool nasm make pkg-config git apt-utils

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

#environment variables
ENV PORT 3000

CMD ["npm", "run", "starttests", "--noinput"]
