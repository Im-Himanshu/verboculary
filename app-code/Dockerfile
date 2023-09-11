
FROM beevelop/ionic

RUN apt update \
    && apt-get install -y \
    build-essential \
    openjdk-8-jre \
    openjdk-8-jdk

RUN npm i -g cordova-res native-run --unsafe-perm=true --allow-root

RUN apt update && \
    apt install -y wget \
    usbutils \
    gradle &&\
    mkdir -p $HOME/.android/avd

WORKDIR /usr/src

RUN npm i -g @angular/cli

RUN npm install -g firebase-tools

RUN apt install xmlstarlet -y

CMD "ionic cordova run android -l"

EXPOSE 4100

USER user