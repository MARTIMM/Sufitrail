#!/usr/bin/sh

set -v -e

# Program to run all possible tasks to build the Android apk

# convert any sxml file
sxml2xml.pl6 --out=config Data/Sxml/config.sxml
sxml2xml.pl6 --in=html --out=html Data/Sxml/www/index.sxml


# set a few shortcuts for command
j='../node_modules/google-closure-compiler/compiler.jar'
c="java -jar $j"
p='js'
#pc="$p/closure-library"
pc="../Data/js-libs/closure-library"
pt="$p/SufiTrail"

# create closure dependencies file
cd www
calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js
#cd ../..

# run compiler
#cd www
$c --compilation_level=WHITESPACE_ONLY --env=BROWSER \
   --js=project-dependencies.js \
   --js="$pt/Observer.js" --js="$pt/SufiData.js" --js="$pt/SufiMap.js" \
   --js="$pt/SufiIO.js" --js="$pt/SufiCenter.js" \
   --js="$pt/StartApp.js" \
   --js_output_file="$p/st-app.js"
cd ..

#   --js="$pt/!**App.js" --js="$pt/StartApp.js" \
#   --js="!**_test.js" \
#   --js=$p/project-dependencies.js \
#   --js="$pt/StartApp.js"

#exit

# build the apk
cordova build

# install on the device
adb install -r -g platforms/android/build/outputs/apk/debug/android-debug.apk

# start showing log
filter-logcat.pl6
