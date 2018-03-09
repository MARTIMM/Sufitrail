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

#-------------------------------------------------------------------------------
sub USAGE ( ) {

  note Q:to/EOHELP/

    Calculate and add area bounds to the track data. This will be skipped if the
    track comes from Garmin devices. These already have bounds information.
    Furthermore, metadata can be added to the track. The modified file is copied
    to directory ./www/tracks.

    Usage:
      gpx-edit.pl6 [--name=<Str>] [--description=<Str>] [--author=<Str>] [--copy=<Str>] [--keys=<Str>] [--linkText=<Str>] [--linkRef=<Str>] <gpx-file>

    Arguments:
      gpx-file              file with track information

    Options:
      --name=<Str>          metadata info: name of track
      --description=<Str>   metadata info: description of track
      --author=<Str>        metadata info: person or group who walked the track
      --copy=<Str>          metadata info: copyrights of the track
      --keys=<Str>          metadata info: keywords describing the track
      --linkText=<Str>      metadata info: text used to describe the link below
      --linkRef=<Str>       metadata info: reference to a site for this track

  EOHELP
}
