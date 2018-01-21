#!/usr/bin/env perl6

use v6;
use XML;
use XML::XPath;
#use Archive::SimpleZip;

#------------------------------------------------------------------------------
sub MAIN (
  Str:D $gpx-file where .IO ~~ :r,
  Str :$name, Str :$description, Str :$author,
  Str :$copy, Str :$keys is copy, Str :$link
) {

  # The valid range of latitude in degrees is -90 and +90 for the southern and northern hemisphere respectively.
  # Longitude is in the range -180 and +180 specifying coordinates west and east of the Prime Meridian, respectively.
  my Hash $lat = { :min(200), :max(-200)};    # use semi infinites
  my Hash $lon = { :min(100), :max(-100)};

  my Instant $t0 = now;

  # load the gpx file
  my XML::XPath $gpx-dom .= new(:file($gpx-file));
  note "Loaded after ", now - $t0, ' sec';

  # get minima and maxima
  for @($gpx-dom.find('//trkpt')) -> $trk {
    my %a = $trk.attribs;
    my $lt = %a<lat>.Num;
    my $ln = %a<lon>.Num;

    $lat<min> = $lt if $lt < $lat<min>;
    $lat<max> = $lt if $lt > $lat<max>;
    $lon<min> = $ln if $ln < $lon<min>;
    $lon<max> = $ln if $ln > $lon<max>;
  }

#note "calculated after ", now - $t0, ' sec';
#note "Lon/Lat: $lat<min max>/$lon<min max>";
#note "Center: ", ([+] $lat<min max>)/2.0, '/', ([+] $lon<min max>)/2.0;

  # store in gpx extensions
  my $root = $gpx-dom.find( '/gpx');
  my XML::Element $extensions-element =
     create-element( $gpx-dom, 'extensions', $root);

  create-element(
    $gpx-dom, 'lat', $extensions-element,
    :attribs(%( :min($lat<min>), :max($lat<max>)))
  );

  create-element(
    $gpx-dom, 'lon', $extensions-element,
    :attribs(%( :min($lon<min>), :max($lon<max>)))
  );

  create-element(
    $gpx-dom, 'center', $extensions-element,
    :attribs(%( :lat(([+] $lat<min max>)/2.0), :lon(([+] $lon<min max>)/2.0)))
  );

  my XML::Element $metadata-element =
     create-element( $gpx-dom, 'metadata', $root);

  # store metadata
  my XML::Text $te;
  if ?$name {
    $te .= new(:text($name));
    create-element( $gpx-dom, 'name', $metadata-element).append($te);
  }

  if ?$description {
    $te .= new(:text($description));
    create-element( $gpx-dom, 'description', $metadata-element).append($te);
  }

  if ?$author {
    $te .= new(:text($author));
    create-element( $gpx-dom, 'author', $metadata-element).append($te);
  }

  if ?$copy {
    $te .= new(:text($copy));
    create-element( $gpx-dom, 'copyright', $metadata-element).append($te);
  }

  if ?$keys {
    $keys ~~ s:g/ ',' / /;
    $te .= new(:text($keys));
    create-element( $gpx-dom, 'keywords', $metadata-element).append($te);
  }

  if ?$link {
    $te .= new(:text($link));
    create-element( $gpx-dom, 'link', $metadata-element).append($te);
  }

  $te .= new(:text(now.DateTime.Str));
  create-element( $gpx-dom, 'time', $metadata-element).append($te);

  # compress(not yet) and save
  my $bname = $gpx-file.IO.basename;
  $bname.IO.spurt(~$root);
#  my $zip = SimpleZip.new("$bname.zip");
#  $zip.add( ~$root, :name($bname));
#  $zip.close;
}

#------------------------------------------------------------------------------
# create element if not there
sub create-element(
  XML::XPath:D $gpx-dom, Str:D $name, XML::Element:D $parent, :%attribs
  --> XML::Element
) {

  my XML::Element $element;
  my $elements = $gpx-dom.find( "./$name", :start($parent), :to-list);

  if ? $elements {
    $element = $elements[0];
  }

  else {
    $element = XML::Element.new(:name($name));
    my XML::Element $first-element;
    for $parent.nodes -> $n {
      next if $n !~~ XML::Element;
      $first-element = $n;
      last;
    }

    if $first-element {
      $parent.insertBefore( $element, $first-element);
    }

    else {
      $parent.append($element);
    }
  }

  if ?%attribs {
    for %attribs.kv -> $k, $v {
      $element.set( $k, $v);
    }
  }

  $element
}
