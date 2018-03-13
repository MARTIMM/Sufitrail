use v6;

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Node;
use SemiXML::Element;
#use XML;

#-------------------------------------------------------------------------------
class Sxml::Tracks {

  has Bool $!initialized = False;
  has SemiXML::Element $!article;
  has SemiXML::Element $!section;
  has SemiXML::Element $!dl;

  #-----------------------------------------------------------------------------
  # $!tracks.list gpx-dir
  method list ( SemiXML::Element $m ) {

    $m.before(
      'h2',
      :attributes({:class<info-header>}),
      :text('List of tracks')
    );
    my SemiXML::Element $ul = $m.before('ul');

    my $count = 1;
    my $gpx-dir = $m.attributes<gpx-dir>.Str // '.';
    my $tracks-path = $m.attributes<tracks-path>.Str // '.';
    my $info-path = $m.attributes<info-path>.Str // '.';

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

      note "Track: $text";
      my Str $data-info-file = $text;
      $data-info-file ~~ s:g/ \s+ /_/;
      $data-info-file = $info-path ~ $data-info-file ~ '.xml';

      my Str $data-gpx-file = $tracks-path ~ $gpx-file.basename;

      $ul.append(
        'li',
        :attributes( hash(
            :id('track' ~ $count++), :class("hreftype"),
            :$data-gpx-file, :$data-info-file,
          )
        ),
        :$text
      );

      # be sure the info file exists
      unless "www/$data-info-file".IO ~~ :e {
        # default content
        my Str $info-text = Q:s:to/EOINFO/;
        <article>
          <section class="info-text">
            <h1 class="info-header"> $text </h1>
            No information available yet
          </section>
        </article>
        EOINFO

        "www/$data-info-file".IO.spurt($info-text);
      }
    }
  }

  #-----------------------------------------------------------------------------
  method initialize ( SemiXML::Element $m ) {

    unless $!initialized {
      $!article .= new(:name<article>);
      $!section = $!article.append(
        'section', :attributes({:class<info-text>})
      );

      $!dl = $!section.append(
        'dl', :attributes({:class<info-tips>})
      );

      $!initialized = True;
    }
  }

  #-----------------------------------------------------------------------------
  method article ( SemiXML::Element $m ) {

    # set title of track info
    $!dl.before(
      'h1',
      :attributes({:class<info-header>}),
      :text(($m.attributes<title>//'No Title').Str)
    );

    # place article in the root
    $m.before($!article);

    # remove dl when there are no entries
    $!dl.remove unless $!dl.nodes.elems;
    $!initialized = False;
  }

  #-----------------------------------------------------------------------------
  method info ( SemiXML::Element $m ) {

    my SemiXML::Element $dd = $!dl.append('dd');
    $dd.insert($_) for $m.nodes.reverse;

    given ($m.attributes<type>//'').Str {
      when 'stamp' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/Stempel.svg'), :class<info-svg>})
        );
      }

      when 'person' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/Persoon.svg'), :class<info-svg>})
        );
      }

      when 'address' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/Adres.svg'), :class<info-svg>})
        );
      }

      when 'telephone' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/Telefoon.svg'), :class<info-svg>})
        );
      }

      when 'email' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/Email.svg'), :class<info-svg>})
        );
      }

      when 'www' {
        $dd.insert(
          'img',
          :attributes({:src('images/Svg/WWW-adres.svg'), :class<info-svg>})
        );
      }
    }
  }

  #-----------------------------------------------------------------------------
  method text ( SemiXML::Element $m ) {

    my SemiXML::Element $hook = $!dl.after('sxml:hook');
    $hook.after($_) for $m.nodes.reverse;
    $hook.remove;
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
