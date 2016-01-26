FROM node:0.10-onbuild

MAINTAINER Clayton Santos da Silva "clayton@xdevel.com.br"

# add project to build
ADD . /root/admin-app
WORKDIR /root/admin-app
RUN npm install
RUN npm install --dev
RUN npm install -g bower
RUN npm install -g gulp
RUN bower  --allow-root  install
RUN gulp build



EXPOSE 3000
CMD ["npm","start"]
