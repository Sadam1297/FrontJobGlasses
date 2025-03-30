
FROM node:18

WORKDIR /usr/src/app

RUN npm install -g create-react-app

CMD [ "npm", "start" ]
