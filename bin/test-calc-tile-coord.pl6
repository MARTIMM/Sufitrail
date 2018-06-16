#!/usr/bin/env perl6

use v6;

=begin comment
  From https://gis.stackexchange.com/questions/17278/calculate-lat-lon-bounds-for-individual-tile-generated-from-gdal2tiles


  function tile2long(x,z) { return (x/Math.pow(2,z)*360-180); }

  function tile2lat(y,z) {
      var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
      return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
  }
=end comment

#-------------------------------------------------------------------------------
# tile coordinate 17/67222/43063
my $zoom = 17;
my $x = 67222;
my $y = 43063;

calcCoord( $x, $y, $zoom);

#-------------------------------------------------------------------------------
sub calcCoord( $x, $y, $z) {
  my Num $long = tile2long( $x, $z);
  my Num $lat = tile2lat( $y, $z);

  note "\nTile 17/$x/$y is for ",
    "longitude {$long.fmt('%.2f')} and latitude {$lat.fmt('%.2f')}";

  note "\nTile x: ", long2tile( $long, $z);
  note "\nTile y: ", lat2tile( $lat, $z);
}

#-------------------------------------------------------------------------------
# note that 2 ** n is the same as 1 shifted left n times
sub tile2long ( Int:D $x, Int $z --> Num ) {
  ( ( $x / (1 +< $z)) * 360 - 180 ).Num
}

#-------------------------------------------------------------------------------
# note that 2 ** n is the same as 1 shifted left n times
sub long2tile ( Num $long, int $z --> Int ) {

  #    $long == ( $x / (1 ** $z) ) * 360 - 180)
  # => ($long + 180 ) / 360 == $x / (1 ** $z)
  # => ($long + 180 ) / 360 * (1 ** $z) == $x

  ( ($long + 180) / 360 * (1 +< $z) ).Int
}

#-------------------------------------------------------------------------------
sub tile2lat ( int $y, int $z --> Num ) {
  my $n = π - 2 * π * $y / (1 +< $z);
note "N 0: $n";
  ( 180.0 / π * atan( 0.5 * ( exp($n) - exp(-$n) )) ).Num
}

#-------------------------------------------------------------------------------
sub lat2tile ( Num $lat, Int $z --> Int ) {

  #    $lat == 180.0 / π * atan( 0.5 * ( exp($n) - exp(-$n) ))
  # => $lat * π / 180 == atan( 0.5 * ( exp($n) - exp(-$n) )
  # => tan( $lat * π / 180 ) == 0.5 * ( exp($n) - exp(-$n) )
  # => tan( $lat * π / 180 ) / 0.5 == exp($n) - exp(-$n)
  # => tan( $lat * π / 180 ) / 0.5 == exp($n) - 1 / exp($n)
  #...

  my Int $n = 1 +< $z;
  my Num $lat-rad = $lat * π / 180;
  ( $n * ( 1 - (log(tan($lat-rad) + sec($lat-rad)) / π )) / 2 ).Int
}
