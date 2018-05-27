[toc]

# Designer notes

## Programming points
* Styles come at the top in /html/head
* Javascript at the bottom of /html/body
* Split current javascript in parts, see below.
* Drop as many external modules as possible
  * Google lib is dropped
  * JQuery is dropped
  * OpenLayers 3 is necessary


## Implementation
The program will be using a Model–View–Adapter (MVA) or mediating-controller Model View Control (MVC) pattern, see [Wikipedia article][MVA]. This pattern is used to separate the storage, control and view from each other. To get things done, an observer/subscription service is created. A data generated in one part can be subscribed to by another. A call from the observer object is made to the subscribers of that specific data when that data becomes available. This pattern is also named 'producer/consumer' pattern.

```plantuml
title Global description of all that is involved
actor user
cloud "user data\ntransport" as network1
cloud "email\ntransport" as network2
node trailServer
node emailServer
package SufiTrailApp

folder tracks [
  user tracks when hiking
  storage of fotos and notes
]

folder cache [
  storage of tiles
]

database SufiTrailDB {
  storage dbUsers
  storage dbTracks
}

user -- index.html
SufiTrailApp - network1
SufiTrailApp -- tracks
SufiTrailApp -- cache
SufiTrailDB -- trailServer
network1 - trailServer
trailServer -- network2
network2 -- emailServer
```

### Data in the model: `SufiData`
* Current location
* Track data
* Cache of map tiles
* Feature data
* Links to external sites
* Get data from `SufiCenter`

### Viewed on display: `SufiMap`
* Map around current location at start or switchable from track to current location and back
* Map around the track
* Informational pages
* Menu to select pages
* Features on map

### Control: `SufiCenter`
* Track gps device data -> `SufiMap`/`SufiData`
* Track state of network -> `SufiData`
* Process user input/gestures -> `SufiMap`/`SufiData`
* Process data changes -> `SufiMap`

```plantuml
title Components and relations of the SufiTrail application
package SufiTrailApp {
  [index.html]
  [SufiData.js] --> HTTPS
  [SufiMap.js]
  [SufiCenter.js]
  [Observer.js]
}
SufiData.js <--> Observer.js
SufiMap.js <--> Observer.js
SufiCenter.js <--> Observer.js

node SufiTrailServer {
  [index.html]
  HTTPS --> [control]
  [email] - Mail
  [database] - MySql
}

control --> email
control <--> database
```

``` plantuml
title Some classes in the SufiTrail Application
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

'note "Menu is a javscript object" as M
object Menu {

}

object Network {

}

object GSM {

}

object OSM {

}

SufiData "1" --* SufiCenter

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

| Key Name | Owner | Description |
|------|-------|-------------|
| track | SufiData | The XML representation of the GPX data |
| trackBounds | SufiData | Calculated boundaries lon/lat of the GPX data |
| gpxFile | SufiCenter | GPX file selected from a menu |
| networkState | SufiCenter | Boolean value to show we are on/offline |
<!-- | deviceReady | SufiCenter | True | -->
| currentLocation | SufiCenter | Geo location data with a position in the structure |
| infoFile | SufiCenter | Data pointing to information file of shown track |
| wanderedOffTrack | SufiData | When current location is too far from track |

#### SufiCenter action diagrams
```plantuml
(*) -> "SufiCenter init"
-> "setup track\nselections"
-> "wait for\ndevice ready"
-> (*)
```

```plantuml
(*) ..>[device ready\nevent] "2nd phase\nSufiCenter init"
-> "SufiMap init"
-> "SufiData init"
-> "setup network\nstate check"
-> "setup GPS watch"
'-> "setup app\ndevice ready"
-up-> (*)
```

```plantuml
(*) .>[offline event] set 'networkState' false
-> (*)
```

```plantuml
(*) .>[online event] set 'networkState' true
-> (*)
```

#### SufiData diagrams
```plantuml
(*) .>[start track\nbutton click] "SufiData.doStartTrack"
if tracking\nstarted then
  -->[Y] "show already\nstarted message"
  -> (*)
else
  ->[N] "subscribe\nto gps"
  --> (*)
endif
```

```plantuml
(*) .>[postpone tracking\nbutton click] "SufiData.doStopTrack"
if tracking\nstarted then
  [Y] if tracking\npostponed then
    -->[Y] "show already\npostponed message"
    -> (*)
  else
    ->[N] "unsubscribe\nfrom GPS"
  endif
  -> (*)
else
  -->[N] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[continue tracking\nbutton click] "SufiData.doContTrack"
if tracking\nstarted then
  [Y] if tracking\npostponed then
    -->[Y] "show continue\ntracking message"
    -> "subscribe\nto gps"
    -> (*)
  else
    ->[N] "show tracking\nalready started message"
  endif
  -> (*)
else
  -->[N] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[save track\nbutton click] "SufiData.doSaveTrack"
if tracking\nstarted then
  -->[Y] "show save\ntrack message"
  -> "unsubscribe\nfrom gps"
  -> "save track data"
  -> (*)
else
  -->[N] "show no track\nstarted message"
  --> (*)
endif
```

```plantuml
(*) .>[currentLocation] "save position\nin array"
->modify bounding box
-> (*)
```

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
