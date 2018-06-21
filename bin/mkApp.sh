#!/usr/bin/sh

set -v

# Program to run all possible tasks to build the Android apk

# create closure dependencies file
cd www/js
calcdeps.py -p closure-library/ -p SufiTrail/ -o deps > project-dependencies.js
cd ../..

# convert any sxml file
sxml2xml.pl6 --out=config Data/Sxml/config.sxml
sxml2xml.pl6 --in=html --out=html Data/Sxml/www/index.sxml

# set shortcut for command
c='java -jar node_modules/google-closure-compiler/compiler.jar'
p='www/js'
pc='www/js/closure-lib/closure/goog'
pt='www/js/SufiTrail'

$c $p/project-dependencies.js $pt/SufiCenter.js $pt/SufiMap.js \
   $pt/SufiData.js $pt/SufiIO.js $pc \
   --js_output_file www/js/st-app.js

exit

# build the apk
cordova build

# install on the device
adb install -r -g platforms/android/build/outputs/apk/debug/android-debug.apk

# start showing log
filter-logcat.pl6
