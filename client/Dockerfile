FROM node:22-slim 

WORKDIR /app 

COPY package*.json ./

RUN ci  

COPY . .

EXPOSE 5731 

CMD [ "npm" , "run" , "dev" , "--" , "--host" ]


