## Setup
1. npm install node@16.13.1






Install node.js specifically 16.x version not greater then that open_ssl isssue otherwise

install ionic and cordova
npm install -g cordova ionic
cordova platform add android

install Android studio -- any version

set 
ANDROID_HOME=C:\Users\jgoyalh1\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\jgoyalh1\AppData\Local\Android\Sdk


create xml file in


follow this guide:
https://ionicframework.com/docs/v6/developing/android
need ionic 

need gradle -- set bin in path
need java -- set JAVA_HOME need to be 1.8
need node.js 16. -- 

ionic cordova build android --prod --release

CI-CD using docker image 
https://github.com/robingenz/docker-ionic-capacitor/tree/main
https://hub.docker.com/r/beevelop/ionic
https://hub.docker.com/r/agileek/ionic-framework
https://www.youtube.com/watch?v=MhVFxEVLAWo&ab_channel=AwaisMirza

series of command 
ionic cordova build android --prod --release
cd .\platforms\android\
./gradlew bundle
cd ../../
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore verboculary.keystore platforms/android/app/build/outputs/bundle/release/app.aab verboculary
enter password as : verboculary

