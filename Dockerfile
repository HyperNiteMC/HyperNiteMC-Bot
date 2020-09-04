FROM node:12

WORKDIR /discord

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
