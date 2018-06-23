#!/usr/bin/env perl6

# Program to run all possible tasks to build the Android apk

use v6;
use File::Directory::Tree;

sub MAIN ( Bool :$debug = True ) {

  note "Be sure that device is connected";

  my Str $script-text = '';

  # convert any sxml file
  $script-text = Q:qq:s:to/EOSCRIPT/;

    set -e -v

    # convert any sxml file
    sxml2xml.pl6 --out=config Data/Sxml/config.sxml
    sxml2xml.pl6 --in=html --out=html Data/Sxml/www/index.sxml

    cd www

    EOSCRIPT

  # compiler and compile command
  my Str $j = '../node_modules/google-closure-compiler/compiler.jar';
  my Str $c = "java -jar $j";

  # javascript root
  my Str $p = '../Data/js-libs';

  # google closure library
  #pc="$p/closure-library/closure"
  my Str $pc = "../Data/js-libs/closure-library/closure";

  # sufitrail project
  my Str $pt = "$p/SufiTrail";

  if $debug {
    note "Creating debug version ...";

    my Str $android = 'platforms/android/build/outputs/apk/debug';
    my Str $apk = 'android-debug.apk';

    $script-text ~= Q:qq:s:to/EOSCRIPT/;

      # everything happens here

      # create closure dependencies file
      calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js

      EOSCRIPT
  }

  else {
    note "Creating release version ...";

    # cleanup first
    #rmtree "js/SufiTrail";

    #my Str $android = 'platforms/android/build/outputs/apk/release';
    my Str $android = 'platforms/android/build/outputs/apk/debug';
    #my Str $apk = 'android-release-unsigned.apk';
    my Str $apk = 'android-debug.apk';

    $script-text ~= Q:qq:s:to/EOSCRIPT/;

      # create closure dependencies file
      calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js

      # run compiler
      $c --compilation_level=WHITESPACE_ONLY --env=BROWSER \\
         --js="$pc/goog/base.js" --js="$pc/goog/!**_test.js" \\
         --js=project-dependencies.js \\
         --js="$pt/Observer.js" --js="$pt/SufiData.js" --js="$pt/SufiMap.js" \\
         --js="$pt/SufiIO.js" --js="$pt/SufiCenter.js" \\
         --js="$pt/StartApp.js" \\
         --js_output_file="js/startapp.js"
      cd ..

      #   --js="$pt/!**App.js" --js="$pt/StartApp.js" \\
      #   --js="!**_test.js" \\
      #   --js=$p/project-dependencies.js \\

      # build the release apk
      #cordova build --release
      cordova build

      # install on the device
      adb install -r -g "$android/$apk"
      EOSCRIPT
  }

  my Str $script = 'SufiTrailBuildScript.sh';
  $script.IO.spurt($script-text);
  my Proc $proc = shell "/usr/bin/sh $script", :out;
  .note for $proc.out.lines;
  $proc.out.close;

  # new script to follow output from app
  $script-text = Q:q:to/EOSCRIPT/;
    echo Start application on mobile device ...
    filter-logcat.pl6
    EOSCRIPT

  $script.IO.spurt($script-text);
  $proc = shell "/usr/bin/sh $script", :out;
  .note for $proc.out.lines;
  $proc.out.close;

#  unlink $script;

#    if $p.exitcode {
#      note "Script did not finish without problems";
#      exit(1);
#    }
}

=finish

set -v -e


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
