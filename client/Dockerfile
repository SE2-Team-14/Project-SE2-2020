# base image
FROM node:latest

# set working directory
RUN mkdir /src
WORKDIR /src

# add src
COPY . /src

# add `/node_modules/.bin` to $PATH
ENV PATH /src/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json src/package.json

RUN npm install 

EXPOSE 3000

# start app
CMD npm start
