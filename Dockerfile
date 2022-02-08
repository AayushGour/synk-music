FROM node:14-alpine
# FROM alpine:3.14
# RUN apk add --update nodejs npm
ENV NODE_ENV production
RUN mkdir /app
RUN npm i http-server -g
WORKDIR /app
COPY ["package.json", "./**.js", "./"]
RUN mkdir /synk-music-ui
WORKDIR /app/synk-music-ui
COPY ["synk-music-ui", "./"]
WORKDIR /app
RUN npm i --silent
RUN npm run build
# ENTRYPOINT npm run serve
CMD [ "npm", "run", "serve" ]