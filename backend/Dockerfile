FROM node:alpine

WORKDIR /usr/src/app
ARG port=5000

ENV DB_URL "mongodb://localhost/timesheet?retryWrites=true"

ENV PORT $port

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $port
CMD [ "npm", "start" ]