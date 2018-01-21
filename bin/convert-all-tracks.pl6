#!/usr/bin/env perl6
use v6;

# Setup command line with fixed data
my Array $cmd .= new(
  'bin/gpx-edit.pl6', '-author=Sultanstrail',
  '-copy=Sultanstrail', '-link=http://www.sultanstrail.com/',
  '-description=hiking routes from Vienna to Istanbul'
);

# do for each of the gpx files
for dir('www/tracks').grep(/ '.gpx' $/) -> $track {

  say "Processing $track";

  # device a name for the metadata
  my Str $name = $track.IO.basename;
  $name ~~ s/ '.gpx' $//;
  $name ~~ s:g/ <.punct> / /;

  # and som keys
  my $keys = (<hike Vienna Istanbul>, $name.split(/\s+/)).join(',');

  # run the program to convert the gpx file
  run( @$cmd, "-name=$name", "-keys=$keys", $track);

#`{{
  run( 'cp', $track, $track.IO.basename);
}}

  # compress result LZMA
  #run( 'xz', '-z', '-k', $track.IO.basename);
}
