FROM docker.turn.com/tops-base/nodejs
MAINTAINER instrumentation@turn.com

ENV WORKDIR /opt/grafana
ENV PORT 3000

RUN     mkdir -p $WORKDIR

WORKDIR $WORKDIR

COPY    resources/package.json $WORKDIR/
COPY    resources/Gruntfile.js $WORKDIR/
COPY    resources/server.js    $WORKDIR/
COPY    resources/src          $WORKDIR/
RUN     npm install && npm install -g grunt-cli && grunt --force && grunt --force build;

EXPOSE  $PORT
ENTRYPOINT  ["node", "server.js"]
