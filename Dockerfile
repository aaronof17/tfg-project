FROM node:16-bullseye

WORKDIR /app

COPY . .

RUN npm isntall

EXPOSE 4000

CMD ["npm","start"]