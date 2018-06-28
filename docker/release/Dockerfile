FROM node:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    npm install -g babel-cli


EXPOSE 3000

CMD ["babel-node", "tools/distServer" ]
