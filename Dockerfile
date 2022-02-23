FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
COPY server/package*.json server/
# RUN npm run install_client --only=production
RUN npm install --prefix client --only=production

# RUN npm run install_server --only=production
RUN npm install --prefix server --only=production

COPY client/ client/
RUN npm run build_docker --prefix client

COPY server/ server/

#change user to a less privileaged user
USER node

# run server
CMD ["npm","start","--prefix","server"]

EXPOSE 8000
