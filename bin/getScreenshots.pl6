#!/usr/bin/env perl6

use v6;

sub MAIN ( ) {

  shell "adb pull /storage/emulated/0/DCIM/Screenshots $*HOME/Desktop";

  chdir("$*HOME/Desktop/Screenshots");

  my Int $count = 0;
  for dir.grep(/^ Screenshot/) -> $image {
    shell "convert $image -resize 150x ss$count.fmt('%02d').jpg";
    $count++;
  }
}
