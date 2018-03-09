#!/usr/bin/env perl6
use v6;

# Setup command line with fixed data
my Array $cmd;
$cmd.push:
  'bin/gpx-edit.pl6',
  '--author="Sufi trail"',
  '--copy="Sufi trail"',
  '--linkRef=http://www.sufitrail.com/',
  '--linkText="Sufi Trail Hike"',
  '--description="hiking routes from Istanbul to Konya"'
  ;


# do for each of the gpx files
for dir('../Data/Tracks original').grep(/ '.gpx' $/) -> $track {

  # devise a name for the metadata
  my Str $name = $track.IO.basename;
  $name ~~ s/ '.gpx' $//;
  $name ~~ s:g/ <.punct> / /;

  # and some keys
  my $keys = (|<hike Istanbul Konya>, |$name.split(/\s+/)).sort.join(',');

  # run the program to convert the gpx file
  run( @$cmd, "--name='$name'", "--keys='$keys'", $track);

  # compress result LZMA
  #run( 'xz', '-z', '-k', $track.IO.basename);
last
}
