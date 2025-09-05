FROM alpine:3.22

# Install Bash, GCC, G++, Node.js, OpenJDK JRE
RUN apk update && apk add --no-cache \
    bash \
    gcc \
    g++ \
    musl-dev \
    python3 \
    nodejs \
    openjdk11 \
    && rm -rf /var/cache/apk/*  # Clean up APK cache to reduce image size

# Remove unnecessary stuff to reduce image size
RUN rm -rf /usr/share/man \
    /usr/share/doc \
    /usr/share/info \
    /usr/share/locale/* \
    /usr/share/man/* \
    /tmp/*

# Set working directory (you can modify this as needed)
WORKDIR /app

# Default command (could be overwritten by the user)
CMD ["bash"]
