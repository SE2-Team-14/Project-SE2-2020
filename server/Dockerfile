# base image
FROM node:latest

# set working directory
RUN mkdir .
# add src
COPY . .

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package.json

RUN npm install 

EXPOSE 3000

# start app
CMD node server.js
