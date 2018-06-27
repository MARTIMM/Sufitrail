#!/usr/bin/env perl6

use v6;
use SufiTrail::Tracks;

sub MAIN ( Str:D $gpx-file where $gpx-file.IO ~~ :r ) {

  note "\nGetting tile coordinates from gpx data in $gpx-file";

  my Hash $h = {};

  my SufiTrail::Tracks $t .= new(:$gpx-file);
  for $t.get-gpx -> [ $long, $lat] {

    loop ( my Int $z = 10; $z < 18; $z++ ) {

      my Int $x = $t.long2tile( $long, $z);
      my Int $y = $t.lat2tile( $lat, $z);

#      note "ln, lt: $long, $lat --> $x, $y, $z";
      $h{$z} = {} unless $h{$z}:exists;
      for $x-1,$x,$x+1 -> $x0 {
        $h{$z}{$x} = {} unless $h{$z}{$x}:exists;
        for $y-1,$y,$y+1 -> $y0 {
          $h{$z}{$x}{$y} = 1;
        }
      }
    }
  }

  my Int $tile-count = 0;
  loop ( my Int $z = 10; $z < 18; $z++ ) {
    for $h{$z}.keys.sort -> $x {
      for $h{$z}{$x}.keys.sort -> $y {
#        note "Tile $z, $x, $y";
        $tile-count++;
      }
    }
  }

  note "$tile-count tiles needed to cache";
}
