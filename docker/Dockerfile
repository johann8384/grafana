FROM docker.turn.com/tops-base/nodejs
MAINTAINER instrumentation@turn.com

ENV WORKDIR /opt/grafana
RUN   mkdir -p $WORKDIR
COPY . $WORKDIR
WORKDIR $WORKDIR

RUN     npm install && npm install -g grunt-cli && grunt --force && grunt --force build;
EXPOSE  3000
CMD   ["node", "./server.js"]

