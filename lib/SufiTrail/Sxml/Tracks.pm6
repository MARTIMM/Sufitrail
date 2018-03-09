use v6;

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Node;
use SemiXML::Element;
use XML;

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
      my Str $text = $gpx-file.IO.basename;
      $text ~~ s/ '.gpx' $//;
      $text ~~ s:g/ <punct> / /;

      $ul.append(
        'li',
        :attributes( hash(
            :id('track' ~ $count++),
            :class("hreftype"),
            :data-gpx-file($prefix-path ~ $gpx-file.IO.basename),
          )
        ),
        :$text
      );
    }
  }
}
