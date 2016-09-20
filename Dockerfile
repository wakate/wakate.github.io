FROM nginx:1.10-alpine

ARG USER
ARG PASS

RUN apk add --update apache2-utils \
  && rm -rf /var/cache/apk/*

COPY /staging/nginx.default.conf /etc/nginx/conf.d/default.conf
RUN htpasswd -bc /etc/nginx/.htpasswd $USER $PASS

COPY build /usr/share/nginx/html
