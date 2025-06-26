FROM node:20.10.0

WORKDIR /usr/src/eclipse

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]