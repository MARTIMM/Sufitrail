[toc]

# Designer notes

## Programming points
* Styles come at the top in /html/head
* Javascript at the bottom of /html/body
* Split current javascript in parts, see below.
* Drop as many external modules as possible
  * JQuery is dropped
  * OpenLayers 3 is necessary

## Introduced google closure again
### Name spaces and module names
* Namespace id used in the cordova config is **io.github.martimm**. I find this a bit too long to create a path like that. So the modules and classes are placed in the javascript directory accordingly. E.g. `www/js/SufiTrail/SufiCenter.js` instead of `www/js/io/github/martimm/SufiCenter.js`.

## Implementation
The program will be using a Model–View–Adapter (MVA) or mediating-controller Model View Control (MVC) pattern, see [Wikipedia article][MVA]. This pattern is used to separate the storage, control and view from each other. To get things done, an observer/subscription service is created. A data generated in one part can be subscribed to by another. A call from the observer object is made to the subscribers of that specific data when that data becomes available. This pattern is also named 'producer/consumer' pattern.

```plantuml
title Global description of all that is involved

'skinparam rectangle {
'	roundCorner<<Concept>> 25
'}

actor user
cloud "user data\ntransport" as network1
cloud "email\ntransport" as network2
cloud "tiles\ntransport" as network3
node trailServer
node tilesServer
node emailServer
package SufiTrailApp {
  artifact index.html

  folder tracks {
    artifact "user\ntracks"
    artifact "fotos\nnotes"
  }

  folder cache {
    artifact tiles
    artifact features
  }
}

database SufiTrailDB {
  storage dbUsers
  storage dbTracks
}

user -- index.html
SufiTrailApp -- network1
SufiTrailApp -- tracks
SufiTrailApp -- cache
SufiTrailDB -- trailServer
tilesServer -- network3
network3 -- SufiTrailApp
network1 - trailServer
trailServer -- network2
network2 -- emailServer
```

### Data in the model: `SufiData`
* Track data
* Cache of map tiles
* Cache of feature data

### Viewed on display: `SufiMap`
* Map around current location at start or switchable from track to current location and back
* Map around the track
* Informational pages
* Menu to select pages
* Features on map
* Display current location

### Control: `SufiCenter`
* Track gps device data -> `SufiMap`/`SufiData`
* Track state of network -> `SufiData`
* Process user input/gestures -> `SufiMap`/`SufiData`
* Process data changes -> `SufiMap`

### Additional: `Observer`
* Add and remove subscription
* Accept data and provide to observer handles

### Additional: `SufiIO`
* Read and write data from and to disk
* Read from tileserver -> `SufiData`
* Send pictures and tracks to sufitrail.net server

### Additional: Server `www.sufitrail.net`
* Keep track of users
* Accept pictures and tracks of users
* Send tracks to other users defined by a set of email addresses of the user.


```plantuml
title Components and relations of the SufiTrail application
package SufiTrailApp {
  [index.html]
  [SufiIO.js] <--> HTTPS
  [SufiData.js]
  [SufiMap.js]
  [SufiCenter.js]
  [Observer.js]
}
SufiData.js <--> Observer.js
SufiMap.js <--> Observer.js
SufiCenter.js <--> Observer.js
SufiCenter.js <--> SufiIO.js

node SufiTrailServer {
  HTTPS --> [control]
  [email] - Mail
  [database] - MySql
}

node TileServer {
  HTTPS --> [map service]
}

control --> email
control <--> database
```

``` plantuml
title Some classes in the SufiTrail Application

package SufiTrail {
  class Observer {
  }

  class SufiData {
  }

  class SufiMap {
  }

  class SufiTrack {
  }

  class SufiFeature {
  }

  class SufiCenter {
  }

  class SufiIO {
  }
}

object Menu {

}

object Network {

}

object GSM {

}

object OSM {

}

note "javscript object\ngenerated from\nSxml project" as Msxml
Menu .. Msxml
note "javscript library\nfrom OpenLayers\nversion 3" as OL3
OSM .. OL3
note "device providing\ncurrent location" as dev1
GSM .. dev1
note "device to\nconnect\nto server" as dev2
Network .. dev2

SufiData "1" --* SufiCenter
SufiIO "1" --* SufiCenter

Observer "1" -* SufiCenter
SufiCenter .. Menu
SufiCenter *- "1" SufiMap
SufiCenter .. Network
SufiCenter .. GSM
SufiCenter .. OSM

SufiTrack "*" --* SufiMap
SufiFeature "*" --* SufiMap
```

#### Keys of values used in the observer

| Key Name | Owner | Description | Data
|------|-------|-------------|----------|
| track | SufiData | The XML representation of the GPX data | XML Dom tree |
| trackBounds | SufiData | Calculated boundaries lon/lat of the GPX data | Array
| gpxFile | SufiCenter | GPX file selected from a menu | file with GPX data
| networkState | SufiCenter | Boolean value to show we are on/offline | boolean
| currentLocation | SufiCenter | Geo location data | position object
| infoFile | SufiCenter | Information of shown track | file with track info
| wanderedOffTrack | SufiData | Current location too far from track | Array
| storedGpxFile | SufiIO | When file is successfully stored | absolute filename
| initStep | * | when a init step is taken | -

<!-- | deviceReady | SufiCenter | True | -->

#### SufiCenter diagrams: initialization
```plantuml
(*) -> "SufiCenter init"
-> "setup track list\nand activate"
-> "get html element\nlist from id list"
-> "activate buttons"
-> "wait for\ndevice ready"
-> (*)
```

```plantuml
(*) .>[device ready\nevent] "SufiMap init"
-> "SufiData init"
-> "setup 'networkState'"
-> "setup 'currentLocation'"
'-> "setup 'deviceReady'"
-> (*)
```

```plantuml
(*) .>[offline event] set 'networkState' false
-> (*)
```

```plantuml
(*) .>[online event] set 'networkState' true
-> (*)
```

#### SufiData diagrams: initialization
```plantuml
(*) -> subscribe to\n'gpxFile'
-> subscribe to\n'infoFile'
-> subscribe to\n'track'
-> subscribe to\n'currentLocation'
-> (*)
```
#### SufiData diagrams: GPX
```plantuml
(*) .>[gpxFile] LoadXMLFile
-> set 'track' gpxContent
-> set trackChanged
-> (*)
```

```plantuml
(*) .>[infoFile] loadInfoFile
-> insert info\non info page
-> (*)
```

```plantuml
(*) .>[track] calculateBounds
-> set 'trackBounds'\nbounds array
-> (*)
```

```plantuml
(*) .>[currentLocation] checkWanderingOffTrack
if trackChanged then
  ->[Yes] "reset trackChanged"
  -> "compare all points\nof track with\ncurrent location"
  if "closest point\ntoo far" then
    ->[Yes] "set 'wanderedOffTrack'\narray of two coordinates"
    --> (*)
  else
    -->[No] (*)
  endif
else
  -->[No] (*)
endif
```

#### SufiData diagrams: tracking
```plantuml
(*) .>[start track\nbutton click] "SufiData.doStartTrack"
if tracking\nstarted then
  -->[Yes] "show already\nstarted message"
  -> (*)
else
  ->[No] "subscribe\nto 'currentLocation'"
  --> (*)
endif
```

```plantuml
(*) .>[postpone tracking\nbutton click] "SufiData.doStopTrack"
if tracking\nstarted then
  [Yes] if tracking\npostponed then
    -->[Yes] "show already\npostponed message"
    -> (*)
  else
    ->[No] "unsubscribe\nfrom 'currentLocation'"
  endif
  -> (*)
else
  -->[No] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[continue tracking\nbutton click] "SufiData.doContTrack"
if tracking\nstarted then
  [Yes] if tracking\npostponed then
    -->[Yes] "show continue\ntracking message"
    -> "subscribe\nto 'currentLocation'"
    -> (*)
  else
    ->[No] "show tracking\nalready started message"
  endif
  -> (*)
else
  -->[No] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[save track\nbutton click] "SufiData.doSaveTrack"
if tracking\nstarted then
  -->[Yes] "show save\ntrack message"
  -> "unsubscribe\nfrom 'currentLocation'"
  -> "save track data"
  -> (*)
else
  -->[No] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[currentLocation] "save position\nin array"
->modify bounding box
-> (*)
```

# Cache data
## Features
Some features must be active. Click on a symbol must show a small dialog with simple text. There might be links on it which lead to web pages which must be shown in a browser window.

Features can only be retrieved when online and links can only be followed when online. Therefore these features must be cached and updated when necessary.


## Tiles
Tiles can only be downloaded when online, so these also must be cached. A directory structure must be setup to accomplish this. Also a special set of the tiles must be saved because there is no need to have tiles for all zoom levels and we don't need all tiles of a specific country where the trail is.

The servers are always having a url with something like `.../${z}/${x}/${y}.png` at the end. An example url is `http://a.tile.thunderforest.com/landscape/17/67222/43063.png` which has **zoomlevel 17** and **x 67222** and **y 43063**. These are png images of 256 by 256 pixels. See also [here][TilesWiki]. The x and y coordinates are tile coordinates which change with the zoom level.

# User data
## Tracks
## Pictures

# Installed plugins
* cordova-plugin-geolocation
* cordova-plugin-device

# Articles
* [You Don't Need the DOM Ready Event][DOMR]
* [Practical Considerations, Hypertext Transfer Protocol -- HTTP/1.1][HYP1]
* [Hypertext Transfer Protocol -- HTTP/1.1][HYP2]


# Contacts from Sufitrail

|Name|Email|Notes|
|----|-----|-----|
| Sedat Çakir | sufitrail@gmail.com | Project leader
| Iris Bezuijen | sufitrail@gmail.com | Web master
| Rob Polko | rob@sultanstrail.nl | Map design
| Tine Lambers | | Office Manager
| Merel van Essen | | Writer of handbook and designer
| Pijke Wees | pijkev@hotmail.com | Cartographer
| Marcel Timmerman | mt1957@gmail.com | Application builder

<!-- References -->
[DOMR]: http://thanpol.as/javascript/you-dont-need-dom-ready
[HYP1]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.1.4
[HYP2]: https://www.w3.org/Protocols/rfc2616/rfc2616.html

[XHR]: https://xhr.spec.whatwg.org/
[HTTP1]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
[XML]: https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
[DOM1]: https://stackoverflow.com/questions/16664205/what-is-the-difference-between-getelementsbytagname-and-getelementsbyname-in-jav

[DIST]: https://www.movable-type.co.uk/scripts/latlong.html

[GPX]: http://www.topografix.com/GPX/1/1/

[GPS]: https://www.w3.org/TR/geolocation-API/

[OnOffLine]: https://www.html5rocks.com/en/mobile/workingoffthegrid/

[MVA]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93adapter
[Observer]: http://www.dofactory.com/javascript/observer-design-pattern

[TilesWiki]: https://wiki.openstreetmap.org/wiki/Tiles

[StackEx1]: https://gis.stackexchange.com/questions/167792/how-to-retrieve-the-tile-url-in-openlayers-3

[math1]: https://en.wikipedia.org/wiki/Trigonometric_functions#Cosecant,_secant_and_cotangent

[slippy map]:
https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code

[goog1]: https://developers.google.com/closure/library/docs/gettingstarted
[goog2]: https://developers.google.com/closure/library/docs/tutorial
[goog3]: http://www.daveoncode.com/category/google-closure/
