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


## Implementing Model View Control pattern
This pattern is used to separate the storage from its view. All modification to the data is done via the control part. Each of the parts can consist of more objects to handle specific details.

### Data in the model
* Current location
* Track data
* Cache of map tiles
* Feature data
* Links to external sites

### Viewed on display
* Map around current location at start
* Map around the track
* Informational pages
* Menu to select pages
* Features on map

### Control
* Process gps device
* Process state of network
*


``` plantuml

class SufiData {
}

class SufiMap {
}

class SufiCenter {
}

'note "Menu is a javscript object" as M
object Menu {
}
'Menu .. M

```


# Articles
* [You Don't Need the DOM Ready Event](http://thanpol.as/javascript/you-dont-need-dom-ready)
* [Practical Considerations, Hypertext Transfer Protocol -- HTTP/1.1]( https://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.1.4)
* [Hypertext Transfer Protocol -- HTTP/1.1](https://www.w3.org/Protocols/rfc2616/rfc2616.html)


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
