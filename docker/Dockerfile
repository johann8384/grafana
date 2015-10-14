FROM docker.turn.com/tops-base/nodejs
MAINTAINER instrumentation@turn.com

ENV WORKDIR /opt/grafana
ENV PORT 3000

RUN   mkdir -p $WORKDIR
COPY . $WORKDIR
WORKDIR $WORKDIR
EXPOSE  $PORT

RUN     npm install && npm install -g grunt-cli && grunt --force && grunt --force build;
ENTRYPOINT  ["node", "server.js"]

