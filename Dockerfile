# Run the docker build command on the appmais server at /var/www/https/beemon.cs.appstate.edu/beestream directory.
# This is the dockerfile for the NodeJS website https://beemon.cs.appstate.edu
# To build: docker build . -t beemon
# To run: docker run -it --name beemon -p 8080:8080 beemon
FROM node:20.9.0-alpine
WORKDIR /var/www/https/beemon.cs.appstate.edu/beestream
RUN apk update && apk upgrade --no-cache \
	&& apk add --no-cache git \
RUN apk add --no-cache ffmpeg
COPY beestream/app ./app/
COPY beestream/config ./config/
COPY beestream/package.json .
COPY package-lock.json .
COPY beestream/postinstall.sh .
COPY beestream/public ./public/
COPY beestream/run_beestream.sh .
COPY beestream/server.js .
COPY beestream/tsconfig.json .
COPY beestream/webpack.config.js .
RUN mkdir video
RUN mkdir videotmp
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install
EXPOSE 8084
ENTRYPOINT npm start