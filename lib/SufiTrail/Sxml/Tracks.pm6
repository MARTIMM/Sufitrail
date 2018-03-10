use v6;

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Node;
use SemiXML::Element;
#use XML;

#-------------------------------------------------------------------------------
class Sxml::Tracks {

#  has Str $!gpx-file;
#  has XML::XPath $!gpx-dom;
#  has Hash $!bounds;
#  has XML::Element $!meta;

  #-----------------------------------------------------------------------------
#  submethod BUILD ( Str:D :$!gpx-file ) {
#    $!gpx-dom .= new(:file($!gpx-file));
#  }

  #-----------------------------------------------------------------------------
  # $!tracks.list gpx-dir
  method list ( SemiXML::Element $m ) {

    $m.before( 'h2', :text<Tracks>);
    my SemiXML::Element $ul = $m.before('ul');

    my $count = 1;
    my $gpx-dir = $m.attributes<gpx-dir>.Str // '.';
    my $prefix-path = $m.attributes<prefix-path>.Str // '.';

    for dir($gpx-dir).grep(/ '.gpx' $/).sort -> $gpx-file {

      my Str $name = self!trackname($gpx-file.Str);

      # Take name if found or take the name of the file otherwise
      my Str $text;
      if ?$name {
        $text = $name;
      }

      else {
        $text = $gpx-file.basename;
        $text ~~ s/ '.gpx' $//;
      }

note "Name: $text";

      $ul.append(
        'li',
        :attributes( hash(
            :id('track' ~ $count++),
            :class("hreftype"),
            :data-gpx-file($prefix-path ~ $gpx-file.basename),
          )
        ),
        :$text
      );
    }
  }

  #-----------------------------------------------------------------------------
  method !trackname ( Str $gpx-file --> Str ) {

    # load the file for some data
    my Str $xml-text = $gpx-file.IO.slurp;

#`{{
# crashes after 2nd time with core dump. should not happen.
# this is a problem within XML and/or perl6
    my XML::Document $doc = from-xml($xml-text);

    # find the name of the track
    my Str $name;

    my Array $elements = $doc.root.elements(:TAG<trk>);
    # there should only be one trk!
    for $elements[0].nodes -> $node {
      if $node ~~ XML::Element and $node.name eq 'name' {
        $name = $node.nodes>>.Str.join('');
        last;
      }
    }
}}

    $xml-text ~~ m:s/ '<trk>' '<name>' $<name>=[<-[\<]>+] '</name>' /;
    my Str $name = $/.hash<name>.Str;
    $name ~~ s/^ Sufi1_ //;
    $name ~~ s:g/ <punct> / /;

    $name
  }
}
