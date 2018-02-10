use v6;

#-------------------------------------------------------------------------------
unit package SufiTrail:auth<github:MARTIMM>;

use SemiXML::Helper;
use XML;
use XML::XPath;

#-------------------------------------------------------------------------------
class Extract {

  has Str $!gpx-file;
  has XML::Document $!gpx-dom;
  has XML::Element $!gpx;
  has XML::Element $!gpx-dest;
  has XML::Element $!meta-dest;

  #-----------------------------------------------------------------------------
  submethod BUILD ( Str:D :$!gpx-file ) {

    # get dom tree from file and get root element
    $!gpx-dom = from-xml-file($!gpx-file);
    $!gpx = $!gpx-dom.root;
  }

  #-----------------------------------------------------------------------------
  method make-gpx-node ( ) {

    # create new element to place waypoints in
    $!gpx-dest .= new(:name<gpx>);

    # set gpx attributes and namespaces
    $!gpx-dest.set(
      'xsi:schemaLocation',
        'http://www.topografix.com/GPX/1/1' ~
        ' http://www.topografix.com/GPX/1/1/gpx.xsd'
    );
    $!gpx-dest.set( 'xmlns:xsi', "http://www.w3.org/2001/XMLSchema-instance");
    $!gpx-dest.set( 'xmlns', "http://www.topografix.com/GPX/1/1");
    $!gpx-dest.set( 'creator', 'Sufi Trail App');
    $!gpx-dest.set( 'version', '1.1');

#`{{
    # set some garmin namespaces used in waypoint data
    $!gpx-dest.set(
      'xmlns:gpxx', "http://www.garmin.com/xmlschemas/GpxExtensions/v3"
    );
    $!gpx-dest.set(
      'xmlns:wptx1', "http://www.garmin.com/xmlschemas/WaypointExtension/v1"
    );
    $!gpx-dest.set(
      'xmlns:ctx', "http://www.garmin.com/xmlschemas/CreationTimeExtension/v1"
    );
    #$!gpx-dest.set( );
}}

    # setup the metadata element and place data there
    my XML::Element $meta = append-element( $!gpx-dest, 'metadata');
    append-element(
      $meta, 'link', {:href<http://www.sufitrail.com/>},
      :text("Sufi Trail Hike")
    );

    append-element(
      $meta, 'keywords', :text('Istanbul,Konya,Totaal,Turkije,hike')
    );

    append-element( $meta, 'copyright', :text("Sufi trail"));
    append-element( $meta, 'author', :text("Sufi trail"));
    append-element(
      $meta, 'description', :text("hiking routes from Istanbul to Konya")
    );
    append-element( $meta, 'name', :text('Turkije Totaal 05 09 2017'));
    append-element( $meta, 'time', :text(now.DateTime.Str));

    $!meta-dest = $meta;
  }

  #-----------------------------------------------------------------------------
  method extract-waypoints (
    Str :$prefix-fn is copy = $!gpx-file.IO.basename
  ) {

    self.make-gpx-node;
    for $!gpx.nodes.reverse -> $node {
      if $node ~~ XML::Element and $node.name eq 'wpt' {
        note "Extract waypoint: ",
          $node.attribs<lon>, ', ', $node.attribs<lat>;

        # remove extensions from the waypoint data because there is no extra
        # information. ctx:CreationTime holds the same data as time and
        # gpxx:WaypointExtension and wptx1:WaypointExtension are the same and
        # not hold interresting data.
        for $node.nodes -> $n {
          $n.remove if $n ~~ XML::Element and $n.name eq 'extensions';
        }

        $!gpx-dest.append($node);
      }
    }

    $prefix-fn ~~ s/\.gpx//;
    my Str $fn = $prefix-fn ~ '-waypoints' ~ '.gpx';
    note "Save waypoints of track to $fn";
    $fn.IO.spurt(
      '<?xml version="1.0" encoding="UTF-8"?>' ~ "\n" ~ $!gpx-dest.Str
    );
  }

  #-----------------------------------------------------------------------------
  method extract-tracks ( Str :$prefix-fn is copy = $!gpx-file.IO.basename ) {

    $prefix-fn ~~ s/\.gpx//;
    my Int $track-count = 0;
    for $!gpx.nodes.reverse -> $node {
      $track-count++ if $node ~~ XML::Element and $node.name eq 'trk';
    }

    for $!gpx.nodes.reverse -> $node {
      if $node ~~ XML::Element and $node.name eq 'trk' {
        self.make-gpx-node;

        # remove extensions from the waypoint data because there is no extra
        # information. ctx:CreationTime holds the same data as time and
        # gpxx:WaypointExtension and wptx1:WaypointExtension are the same and
        # not hold interresting data.
        for $node.nodes -> $n {
          $n.remove if $n ~~ XML::Element and $n.name eq 'extensions';
        }

        self.calculate-store-bounds($node);
        $!gpx-dest.append($node);

        my Str $fn = [~] $prefix-fn, '-track',
                     $track-count.fmt('%02d'), '.gpx';
        $track-count--;
        note "Save track to $fn";

        $fn.IO.spurt(
          '<?xml version="1.0" encoding="UTF-8"?>' ~ "\n" ~ $!gpx-dest.Str
        );
      }
    }
  }

  #-----------------------------------------------------------------------------
  method calculate-store-bounds ( XML::Element $trk ) {

    my Hash $bounds = {
      # The valid range of latitude in degrees is -90 and +90 for the southern
      # and northern hemisphere respectively.
      :minlat(200), :maxlat(-200),

      # Longitude is in the range -180 and +180 specifying coordinates west and
      # east of the Prime Meridian, respectively.
      :minlon(100), :maxlon(-100)
    }

    # get minima and maxima
    my XML::XPath $xpath .= new(:xml(~$trk));
    for @($xpath.find('//trkpt')) -> $trkpt {
      my %a = $trkpt.attribs;
      my $lt = %a<lat>.Num;
      my $ln = %a<lon>.Num;

      $bounds<minlat> = $lt if $lt < $bounds<minlat>;
      $bounds<maxlat> = $lt if $lt > $bounds<maxlat>;
      $bounds<minlon> = $ln if $ln < $bounds<minlon>;
      $bounds<maxlon> = $ln if $ln > $bounds<maxlon>;
    }

    # convert all values to Str
    $bounds = %( ($bounds.keys) Z=> ($bounds.values>>.Str) );

    append-element( $!meta-dest, 'bounds', $bounds);
  }
}
