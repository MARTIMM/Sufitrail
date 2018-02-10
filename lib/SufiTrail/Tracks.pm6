use v6;

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Helper;
use XML::XPath;
use XML;

#-------------------------------------------------------------------------------
class Tracks {

  has Str $!gpx-file;
  has XML::XPath $!gpx-dom;
  has Hash $!bounds;
  has XML::Element $!meta;

  #-----------------------------------------------------------------------------
  submethod BUILD ( Str:D :$!gpx-file ) {
    $!gpx-dom .= new(:file($!gpx-file));
    $!bounds = {};

    $!meta = self!create-element(
      $!gpx-dom, 'metadata', $!gpx-dom.find('/gpx')
    );
  }

  #-----------------------------------------------------------------------------
  method garmin-data ( --> Bool ) {

    my XML::Element $link = $!gpx-dom.find( '/gpx/metadata/link', :to-list)[0];

    # return True if a Garmin reference was found in the metadata
    $link.defined and $link.attribs<href> eq 'http://www.garmin.com'
  }

  #-----------------------------------------------------------------------------
  method calculate-bounds ( ) {

    $!bounds = {
      # The valid range of latitude in degrees is -90 and +90 for the southern
      # and northern hemisphere respectively.
      :minlat(200), :maxlat(-200),

      # Longitude is in the range -180 and +180 specifying coordinates west and
      # east of the Prime Meridian, respectively.
      :minlon(100), :maxlon(-100)
    }

    # get minima and maxima
    for @($!gpx-dom.find('//trkpt')) -> $trk {
      my %a = $trk.attribs;
      my $lt = %a<lat>.Num;
      my $ln = %a<lon>.Num;

      $!bounds<minlat> = $lt if $lt < $!bounds<minlat>;
      $!bounds<maxlat> = $lt if $lt > $!bounds<maxlat>;
      $!bounds<minlon> = $ln if $ln < $!bounds<minlon>;
      $!bounds<maxlon> = $ln if $ln > $!bounds<maxlon>;
    }

    # convert all values to Str
    $!bounds = %( ($!bounds.keys) Z=> ($!bounds.values>>.Str) );
  }

  #-----------------------------------------------------------------------------
  method store-bounds ( ) {

    # store gpx data the same way as Garmin does
    self!create-element( $!gpx-dom, 'bounds', :attribs(%$!bounds));
  }

  #-----------------------------------------------------------------------------
  method store-metadata (
    Str :$name, Str :$description, Str :$author, Str :$copy,
    Str :$keys is copy, Str :$link-text, Str :$link-ref
  ) {

    # store metadata
    self!create-element( $!gpx-dom, 'name', :text($name)) if ?$name;

    self!create-element( $!gpx-dom, 'description', :text($description))
      if ?$description;

    self!create-element( $!gpx-dom, 'author', :text($author))
      if ?$author;

    self!create-element( $!gpx-dom, 'copyright', :text($copy)) if ?$copy;

    self!create-element( $!gpx-dom, 'keywords', :text($keys)) if ?$keys;

    self!create-element(
      $!gpx-dom, 'link', :attribs(%(href => $link-ref)), :text($link-text)
    ) if (?$link-ref and ?$link-text);

    self!create-element( $!gpx-dom, 'time', :text(now.DateTime.Str));
  }

  #-----------------------------------------------------------------------------
  method save ( Str :$filename = $!gpx-file.IO.basename ) {

    my $root = $!gpx-dom.find('/gpx');
    $filename.IO.spurt(
      '<?xml version="1.0" encoding="UTF-8"?>' ~ "\n" ~ $root.Str
    );

  #  compress(not yet) and save
  #  my $bname = $!gpx-file.IO.basename;
  #  my $zip = SimpleZip.new("$bname.zip");
  #  $zip.add( ~$root, :name($bname));
  #  $zip.close;
  }

  #-----------------------------------------------------------------------------
  # create element in metadata. replace it if already there
  method !create-element(
    XML::XPath:D $!gpx-dom, Str:D $name, XML::Element:D $parent = $!meta,
    :%attribs, Str :$text
    --> XML::Element
  ) {

    my XML::Element $element = $!gpx-dom.find(
      "./$name", :start($parent), :to-list
    )[0];

    $element.remove if ? $element;
    $element = insert-element( $parent, $name, %attribs);
    $element.append(SemiXML::XMLText.new(:$text)) if ?$text;

    $element
  }

  #-----------------------------------------------------------------------------
  #| $!tracks.list gpx-dir
  method list ( XML::Element $parent, Hash $attrs --> XML::Element ) {

    append-element( $parent, 'h2', :text<Tracks>);
    my XML::Element $ul = append-element( $parent, 'ul');

    my $count = 1;
    my $gpx-dir = $attrs<gpx-dir>.Str // '.';
    my $prefix-path = $attrs<prefix-path>.Str // '.';
    for dir($gpx-dir).grep(/ '.gpx' $/).sort -> $gpx-file {
      my Str $text = $gpx-file.IO.basename;
      $text ~~ s/ '.gpx' $//;
      $text ~~ s:g/ <punct> / /;
      append-element(
        $ul, 'li', %(
          :id('track' ~ $count++),
          :class("hreftype"),
          :data-gpx-file($prefix-path ~ $gpx-file.IO.basename),
        ),
        :$text
      );
    }

    $parent;
  }
}