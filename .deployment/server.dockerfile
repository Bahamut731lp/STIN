# Build backend
FROM denoland/deno:alpine

RUN apk update
RUN apk add git

RUN git clone https://github.com/Bahamut731lp/STIN.git /app
WORKDIR /app/server

EXPOSE 8000

CMD ["run", "--allow-all", "run.ts"]

# Build frontend
# FROM 