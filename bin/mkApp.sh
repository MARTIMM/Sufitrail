#!/usr/bin/sh

set -v

# Program to run all possible tasks to build the Android apk

# create closure dependencies file
cd www/js
calcdeps.py -p closure-library/ -p SufiTrail/ -o deps > project-dependencies.js

# convert any sxml file
cd ../..
sxml2xml.pl6 --out=config Data/Sxml/config.sxml
sxml2xml.pl6 --in=html --out=html Data/Sxml/www/index.sxml

# build the apk
cordova build

# install on the device
adb install -r -g platforms/android/build/outputs/apk/debug/android-debug.apk

# start showing log
bin/filter-logcat.pl6
