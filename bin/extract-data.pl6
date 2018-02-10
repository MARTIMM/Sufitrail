#!/usr/bin/env perl6

use v6;
use SufiTrail::Extract;

use XML;
use XML::XPath;

#-------------------------------------------------------------------------------
sub MAIN ( Str:D $gpx-file where $gpx-file.IO ~~ :r ) {

  note "\nProcessing data in $gpx-file";

  my Str $prefix-fn = "www/tracks/" ~ $gpx-file.IO.basename;

  my SufiTrail::Extract $t .= new(:$gpx-file);
  $t.extract-waypoints(:$prefix-fn);

  $t .= new(:$gpx-file);
  $t.extract-tracks(:$prefix-fn);
}
