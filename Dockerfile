FROM node:12

WORKDIR /discord

COPY package*.json ./

RUN npm install

COPY . .

VOLUME /src/secret

CMD [ "npm", "run", "start" ]
