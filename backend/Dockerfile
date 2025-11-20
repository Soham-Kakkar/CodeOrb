FROM alpine:3.22

RUN apk update && apk add --no-cache \
    bash \
    gcc \
    g++ \
    musl-dev \
    python3 \
    nodejs \
    openjdk17 \
    && rm -rf /var/cache/apk/* /usr/share/doc /usr/share/man /usr/share/info /usr/share/locale /var/log/* /var/tmp/* /tmp/* \
    && rm -rf /usr/lib/python*/ensurepip /usr/lib/python*/site-packages/*-info /usr/share/python*/man /usr/share/python*/doc \
    && rm -rf /usr/lib/node_modules /root/.npm /usr/share/man/*node* \
    && rm -rf /usr/share/gcc /usr/share/man/*gcc* /usr/include/*/gnu \
    && rm -rf /usr/lib/jvm/*/src.zip /usr/lib/jvm/*/lib/man

WORKDIR /app
CMD ["bash"]
