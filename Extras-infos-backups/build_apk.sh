# Shell Script to build and sign an aab and apk (Android App Bundle)


# INITIALIZATIONS


# Make a dir "executables" if it does not exist
mkdir executables -p
# Make a directory "assets" in "executables" if it does not exist
mkdir executables/assets -p
# Copy keystore file into executables and override if it exists
cp -f verboculary.keystore executables


# VERSION NUMBER CHANGE IN config.xml


# Ask for version number for build
printf "Enter version no : "
read -r version
# Change version number in config file
xmlstarlet pyx config.xml | grep -v "^Axmlns " | xmlstarlet p2x | xmlstarlet ed -u widget/@version -v $version -a widget --type attr -n xmlns -v "http://www.w3.org/ns/widgets" > intermediate.xml
# Add utf-8 encoding to xml attribute that gets lost during starlet edit
sed "s#<?xml version=[\"|']1.0[\"|']?>#<?xml version=\'1.0\' encoding=\'utf-8\' ?>#" intermediate.xml -i
# Rename and overwrite new.xml to config.xml
mv -f intermediate.xml config.xml


# APK BUILDING 


# Ionic build
ionic cordova build android --prod --release
mv -f platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk executables/assets/app-unsigned.apk
# Generating app bundle
cd platforms/android/
./gradlew bundle
cd ../..
mv -f platforms/android/app/build/outputs/bundle/release/app.aab executables/assets/aab_signed.aab
# Signing the aab with keystore
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore executables/verboculary.keystore executables/assets/aab_signed.aab verboculary
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore verboculary.keystore platforms/android/app/build/outputs/bundle/release/app.aab verboculary
