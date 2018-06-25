#!/usr/bin/env perl6

# Program to run all possible tasks to build the Android apk

use v6;

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

  # javascript root
  my Str $p = '../Data/js-libs';

  # google closure library
  my $goog-path = 'closure-library/closure/goog';
  my Str $pc = "../Data/js-libs/$goog-path";

  # sufitrail project
  my Str $pt = "$p/SufiTrail";

  my Str $cordova = "cordova build";
  my Str $android;
  my Str $apk;

  if $debug {
    note "Creating debug version ...";

    $android = 'platforms/android/build/outputs/apk/debug';
    $apk = 'android-debug.apk';

    'www/js/startapp-0.js'.IO.spurt(Q:qq:s:to/EOSCRIPT/);
      goog.require('SufiTrail.StartApp');
      //goog.global.starter = new SufiTrail.StartApp();
      //starter.start();

      EOSCRIPT

    $script-text ~= Q:qq:s:to/EOSCRIPT/;

      # cleanup old stuff
      rm -rf js/SufiTrail js/closure-library

      # copy 'new' stuff
      mkdir -p js/$goog-path js/SufiTrail
      cp $pc/base.js js/$goog-path
      cp $pt/* js/SufiTrail

      # create closure dependencies file
      calcdeps.py -p js/closure-library -i js/startapp-0.js -p js/SufiTrail \\
                  -o deps > js/startapp.js

      cat js/startapp-0.js >> js/startapp.js
      EOSCRIPT

    $cordova ~= " --debug";
  }

  else {
    note "Creating release version ...";

    $script-text ~= Q:qq:s:to/EOSCRIPT/;
      # cleanup old stuff
      rm -rf js/SufiTrail, js/closure-library

      # copy 'new' stuff
      mkdir -p js/$goog-path
      cp $pc/base.js js/$goog-path

      EOSCRIPT


    # compiler and compile command
    my Str $j = '../node_modules/google-closure-compiler/compiler.jar';
    my Str $c = "java -jar $j";


    #$android = 'platforms/android/build/outputs/apk/release';
    #$apk = 'android-release-unsigned.apk';
    $android = 'platforms/android/build/outputs/apk/debug';
    $apk = 'android-debug.apk';

    $script-text ~= Q:qq:s:to/EOSCRIPT/;

      # create closure dependencies file
      calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js

      # run compiler
      $c --compilation_level=WHITESPACE_ONLY --env=BROWSER \\
         --js="$pc/base.js" --js="$pc/!**_test.js" \\
         --js=project-dependencies.js \\
         --js="$pt/Observer.js" --js="$pt/SufiData.js" --js="$pt/SufiMap.js" \\
         --js="$pt/SufiIO.js" --js="$pt/SufiCenter.js" \\
         --js="$pt/StartApp.js" \\
         --js_output_file="js/startapp.js"
      cd ..

      #   --js="$pt/!**App.js" --js="$pt/StartApp.js" \\
      #   --js="!**_test.js" \\
      #   --js=$p/project-dependencies.js \\

      EOSCRIPT

    #$cordova ~= " --release";
  }


  $script-text ~= Q:qq:s:to/EOSCRIPT/;
    cd ..

    # build the release apk
    $cordova

    # install on the device
    adb install -r -g "$android/$apk"

    echo Start application on mobile device ...
    filter-logcat.pl6
    EOSCRIPT

  my Str $script = 'SufiTrailBuildScript.sh';
  $script.IO.spurt($script-text);
  my Proc $proc = shell "/usr/bin/sh $script", :out;
  .note for $proc.out.lines;
  $proc.out.close;

#`{{
  # new script to follow output from app
  $script-text = Q:q:to/EOSCRIPT/;
    echo Start application on mobile device ...
    filter-logcat.pl6
    EOSCRIPT

  $script.IO.spurt($script-text);
  $proc = shell "/usr/bin/sh $script", :out;
  .note for $proc.out.lines;
  $proc.out.close;
}}
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
