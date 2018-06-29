use v6;

=begin comment
  Lib is used by sxml2xml files.
  This module is used to provide manipulations on behalf of the config.sxml
=end comment

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Node;
use SemiXML::Element;
use XML::XPath;
#use XML;

#-------------------------------------------------------------------------------
class Sxml::Config {

  has XML::XPath $!gpx-dom;

  #-----------------------------------------------------------------------------
  method version ( SemiXML::Element $m ) {

    $!gpx-dom .= new(:file<config.xml>);
    my XML::Element $widget = $!gpx-dom.find( '/widget', :to-list)[0];
    $m.after(:text($widget.attribs<version>.Str));
  }
}
