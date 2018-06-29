#!/usr/bin/env perl6

# Program to run all possible tasks to build the Android apk

use v6;

enum CompilerLevel <BUNDLE WHITESPACE_ONLY SIMPLE ADVANCED>;

sub MAIN ( Bool:D :$debug, CompilerLevel :$level = SIMPLE ) {

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

      # copy the base.js into start script. this can then be left out from the
      # index.html.
      #cat $pc/base.js > js/startapp.js

      # create closure dependencies file
      calcdeps.py -p js/closure-library -i js/startapp-0.js -p js/SufiTrail \\
                  -o deps > js/startapp.js

      cat js/startapp-0.js >> js/startapp.js
      EOSCRIPT

    $cordova ~= " --debug android";
  }

  else {
    note "Creating release version ...";
    my Str $compiler-level = $level.Str;

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


    $android = 'platforms/android/build/outputs/apk/release';
    $apk = 'android-release-unsigned.apk';

    $script-text ~= Q:qq:s:to/EOSCRIPT/;

      # create closure dependencies file
      calcdeps.py -p $pc -p $pt -o deps > project-dependencies.js

      # run compiler
      $c --compilation_level=$compiler-level --env=BROWSER \\
         --js="js/$goog-path/base.js" --js="js/$goog-path/!**_test.js" \\
         --js=project-dependencies.js \\
         --js="$pt/Observer.js" --js="$pt/SufiData.js" --js="$pt/SufiMap.js" \\
         --js="$pt/SufiIO.js" --js="$pt/SufiCacheData.js" \\
         --js="$pt/SufiCache.js" \\
         --js="$pt/SufiCenter.js" --js="$pt/StartApp.js" \\
         --js_output_file="js/startapp.js"

      EOSCRIPT

    $cordova ~= " --release android";
  }


  $script-text ~= Q:qq:s:to/EOSCRIPT/;
    cd ..

    # build the release apk
    $cordova

    EOSCRIPT

  # See https://stackoverflow.com/questions/26449512/how-to-create-a-signed-apk-file-using-cordova-command-line-interface
  unless $debug {
    my Str $key-store = "$android/SufiTrail.keystore";
    if $key-store.IO !~~ :e {
      $script-text ~= Q:qq:s:to/EOSCRIPT/;
        # make a key store before signing
        /usr/bin/keytool -genkey -v -keystore "$key-store" \\
          -alias SufiTrail -keyalg RSA -keysize 2048 -validity 10000

        EOSCRIPT
    }

    $script-text ~= Q:qq:s:to/EOSCRIPT/;
      # sign the release
      /usr/bin/jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \\
        -keystore "$key-store" "$android/$apk" SufiTrail

      # opimize the apk
      rm -f "$android/SufiTrail.apk"
      zipalign -v 4 "$android/$apk" "$android/SufiTrail.apk"

      EOSCRIPT

    $apk = "SufiTrail.apk";
  }

  $script-text ~= Q:qq:s:to/EOSCRIPT/;

    # install on the device
    set +e
    #adb uninstall sufitrail.io.github.martimm
    #set -e
    adb install -r -g "$android/$apk"

    echo Start application on mobile device ...
    filter-logcat.pl6
    EOSCRIPT

  my Str $script = 'SufiTrailBuildScript.sh';
  $script.IO.spurt($script-text);
  my Proc $proc = shell "/usr/bin/sh $script", :out;
  .note for $proc.out.lines;
  $proc.out.close;
}
