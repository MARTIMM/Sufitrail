#!/usr/bin/sh

if [ "x$1" == "xdebug" ]; then
  debug="true"
else
  debug="false"
fi;


# Program to run all possible tasks to build the Android apk

set -v -e

# convert any sxml file
sxml2xml.pl6 --out=config Data/Sxml/config.sxml
sxml2xml.pl6 --in=html --out=html Data/Sxml/www/index.sxml

set +v

# make debugging version
if [ $debug == "true" ]; then
  echo Creating debug version ...
# copy files

  set -v

  # build the debug apk
  cordova build

  # install on the device
  android='platforms/android/build/outputs/apk/debug'
  adb install -r -g "$android/android-debug.apk"

# make a release version
else
  echo Creating release version ...

  set -v

  # set a few shortcuts for command
  j='../node_modules/google-closure-compiler/compiler.jar'
  c="java -jar $j"
  p='../Data/Project/js'
  #pc="$p/closure-library/closure"
  pc="../Data/js-libs/closure-library/closure"
  pt="$p/SufiTrail"


  cd www

  # cleanup first
  #rm -rf js/SufiTrail

  # create closure dependencies file
  calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js

  # run compiler
  #cd www
  $c --compilation_level=WHITESPACE_ONLY --env=BROWSER \
     --js="$pc/goog/base.js" --js="$pc/goog/!**_test.js" --js=project-dependencies.js \
     --js="$pt/Observer.js" --js="$pt/SufiData.js" --js="$pt/SufiMap.js" \
     --js="$pt/SufiIO.js" --js="$pt/SufiCenter.js" \
     --js="$pt/StartApp.js" \
     --js_output_file="js/startapp.js"
  cd ..

  #   --js="$pt/!**App.js" --js="$pt/StartApp.js" \
  #   --js="!**_test.js" \
  #   --js=$p/project-dependencies.js \


  # build the release apk
  #cordova build --release
  cordova build

  # install on the device
  android='platforms/android/build/outputs/apk/release'
  #adb install -r -g "$android/android-release-unsigned.apk"
  adb install -r -g "$android/android-release-unsigned.apk"
fi;

# start showing log
set +e +v
echo "Start application on mobile device ..."

set +v
filter-logcat.pl6
