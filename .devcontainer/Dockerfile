FROM ruby:2.7-bullseye

RUN apt-get update -qq && \
    apt-get install -y build-essential libxslt-dev libxml2-dev cmake && \
    apt-get install -y nodejs npm && \
    npm install n -g && \
    n 16.13.0 && \
    apt-get purge -y nodejs npm && \
    apt-get autoremove -y && \
    apt-get clean -y && \
    rm -rf /var/lib/apt/lists/*

ENV APP_ROOT /{name}
RUN mkdir -p $APP_ROOT

WORKDIR $APP_ROOT

ADD . $APP_ROOT
