# Build backend
FROM node:current-alpine

RUN apk update
RUN apk add git

RUN git clone https://github.com/Bahamut731lp/STIN.git /app
WORKDIR /app/client

RUN npm install
RUN npm install http-server -g
RUN npm run build

EXPOSE 80

CMD ["http-server", "./dist", "-p", "80"]

# Build frontend
# FROM 