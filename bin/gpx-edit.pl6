#!/usr/bin/env perl6

use v6;
use SufiTrail::Tracks;

#use XML;
#use XML::XPath;
#use Archive::SimpleZip;

#note "A: ", @*ARGS.join(" ");

#-------------------------------------------------------------------------------
sub MAIN (
  Str:D $gpx-file where $gpx-file.IO ~~ :r,
  Str :$name, Str :$description, Str :$author, Str :$copy,
  Str :$keys is copy, Str :linkText($link-text), Str :linkRef($link-ref)
) {

  note "\nProcessing track in $gpx-file";

  my SufiTrail::Tracks $t .= new(:$gpx-file);

  # check for garmin data. if True, we do not have to calculate the bounds
  unless $t.garmin-data {
    $t.calculate-bounds;
    $t.store-bounds;
  }

  $t.store-metadata(
    :$name, :$description, :$author, :$copy, :$keys, :$link-text, :$link-ref
  );

  my Str $new-gpx = "www/tracks/" ~ $gpx-file.IO.basename;
  note "Save converted track to $new-gpx";
  $t.save(:filename($new-gpx));
}
