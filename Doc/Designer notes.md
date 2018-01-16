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
The program will be using a Model–view–adapter (MVA) or mediating-controller Model View Control (MVC) pattern, see [Wikipedia article][MVA].
This pattern is used to separate the storage from its view. All modification to the data is done via the control part. Each of the parts can consist of more objects to handle specific details.

### Data in the model: `SufiData`
* Current location
* Track data
* Cache of map tiles
* Feature data
* Links to external sites
* Get data from `SufiCenter`

### Viewed on display: `SufiMap`
* Map around current location at start
* Map around the track
* Informational pages
* Menu to select pages
* Features on map

### Control: `SufiCenter`
* Track gps device data -> `SufiMap`/`SufiData`
* Track state of network -> `SufiData`
* Process user input/gestures -> `SufiMap`/`SufiData`
* Process data changes -> `SufiMap`


``` plantuml

class Cache {

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

Cache "1" --* SufiData
DataHandler "1" --* SufiData
SufiData "1" --* SufiCenter

SufiCenter .. Menu
SufiCenter *- "1" SufiMap
SufiCenter .. Network
SufiCenter .. GSM
SufiCenter .. OSM

SufiTrack "*" --* SufiMap
SufiFeature "*" --* SufiMap


```


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

[GPX]: http://www.topografix.com/GPX/1/1/

[OnOffLine]: https://www.html5rocks.com/en/mobile/workingoffthegrid/

[MVA]: https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93adapter
[Observer]: http://www.dofactory.com/javascript/observer-design-pattern
