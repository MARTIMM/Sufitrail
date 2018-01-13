# Sultans Trail Project

**Table of contents**
[TOC]

# Requirements for this project

Because this application is primarily made for a group who are wandering a trail which the [sultans](http://www.sultanstrail.com/) of past times had walked and another strolled by [sufi's](http://sufitrail.com/), the application is mainly build around these tracks. The track consists of several parts. There are also bicycle routes.

What is provided for each of these tracks are the following;

* Track information. Where and how to walk or bike the track.
  * Complete track display and focus on startup of application.
  * Choose part of the track and type, bicycle or walking tracks. Also focus when selected.
  * Show current location using GPS.
  * Icon-like pictures to show features. These are from the map.
  * Some features have extra information shown in a balloon when clicked. More information is shown on a separate page.
  * Possibilities to book a room or make a reservation.
  * Warning signals when wandering off route. E.g. a dotted line is shown from the nearest point on the track to the current location.
  * Directions on the route. E.g. turn left/right or cross a field etc.

* Information of access points. Can be turned on and off. These are places on the map where one can go nearby the start or end points of the route selected to walk. Long routes should also have access points along the route to be able to walk the trail in parts. The access points are points like airports, bus- and train stations. Also, when arriving by car, places to leave the car safely is useful.
* ? Information of connection/crossing points with other trails.
* ? Make notes and pictures and mark them on the map using small icons
*

It should be obvious that these trails cost a bit of money because it is a lot of work to mark the trail along the route and to travel more than once to the trail to get this work done. Furthermore there is also work to provide an historic background of the route.

Perhaps, later, it would be possible to add other routes to the set by other enthusiastic people willing to put some time in their favorite trails. And there are lots of them like the [Camino de Santiago](http://santiago-compostela.net/) trails, [Grand Randonnees](http://www.gr-infos.com/gr-nl.htm)


## Software needed
Many packages and libraries are needed to implement and build the application.

### A list of what is needed;
* **Android SDK** to develop android mobile applications
* **Cordova** to pack javascript, html and css into an application
* **Nodejs** to load cordova and other javascript libraries locally
* **OpenLayers** to show and manipulate layers of maps and other map oriented thingies
* **Javascript** Version 6 or 7.
* **Html5** to build page
* **Css3** to style the page

### Maybe needed
* **Backbone** javascript lib to have a MVC framework and to communicate with a server
* **Tilemill**
* **Google Closure** Javascript library, its more like an ecosystem! (Instead of jQuery), Compiling!

### Cordova plugins
* **cordova-plugin-device-motion**  [info](http://cordova.apache.org/docs/en/7.x/reference/cordova-plugin-device-motion/), This plugin provides access to the device's accelerometer.

## Planning
```mermaid
gantt
  dateFormat  YYYY-MM-DD
  title Sultansrail Develop Project

  section setup
  create environment using cordova :done, s0, 2017-09-26, 1d
  setup manual, and other docs :done, s1, 2017-09-26, 1d

  section design
  write requirements doc        :done, req, 2017-10-01, 6d
  write design doc              :done, des, 2017-10-01, 6d

  section Implementation
  html              :active, html, after des, 40d
  javascript        :active, js, after des, 40d
  replace jquery with closure: crit, 2017-10-21, 7d
  user interface    :active, ui, , 5d
  data structure    :active, ds, , 5d
  write manual      : man, after ui, 10d

  section Testing
  test in browser   :active, br, after html, 20d
  test on emulator  :active, em, after html, 20d
  test on tablet    :active, tablet, after em, 1d

  section Completion
  compile and minify  : cmfy, after tablet, 1d
  test compiled       : tcmfy, after cmfy, 2d
  publish             : pstore, after tcmfy, 5d

```

# Design and Implementation
As stated above, the application is mainly designed for a specific group of users, namely the group marking the sufitrail and the sultanstrail. To make sure that other trails can be added in the future, the design must be done in such a way that this would be possible. This will also make it possible that trails can be bought separately in an otherwise free or cheap application. There must also be a server to deliver the tracks. This can be done in the form of an app where the program part can start the mapping app and inject the data into that applications environment. The easiest way must be found still.

## Design
The project should designed in such a way that the application can help gathering the data which can make the trail interesting. This data

### Applications and services
In several diagrams is displayed what the application will do with the data and how data is packed into a trail app.

```plantuml
usecase (GPS data) as gps
usecase (pictures) as pic
usecase (Mapping\napplication) as m
usecase (user\nnotes) as n
usecase (uploader for\npacking) as u
usecase (server store\nfor data) as st

actor :Google\nplaystore: as ps
actor :Mobile user: as client
actor :Application\ndeveloper: as d

note "Download and install\napplication and track\ndata" as N1
note "App bundles data and uploads to server" as N2

N1 . client
client -> m
ps --> m : download\nand\ninstall app

m --> pic
m --> n
m --> gps

pic --> u
n --> u
gps --> u

u .. N2
st --> m : tracks and\nnew data
st <--> d
u -> st : user generated\ndata
ps <-- d : application

```

### User interface
The following items must be available
* An area where the map can be shown
* A button to display an expandable area where buttons or textual links are displayed for other actions.
  * load a trail and display a track centered on the map.
  * make a note in a notebook. Mark it on the map with a small icon.
  * make photograps to be placed on the map. Mark it with a small icon.
* Display a track when already loaded.
* Buttons to zoom the map.
* Layers to show specific details on the map.
  * Note and photo marks layer
  * Route layer
  * Access points layer
  * POI layer

### Data structure

### Useful external links
* [Global wheater forecast ](https://earth.nullschool.net/#current/wind/surface/level/orthographic=-354.15,49.32,581)
* [Reservations](Booking.com)

# Usage
* Install from app store

# Privacy issues

# Implementation
# Procedures to define the app using Cordova etc

## Install and setup

* Assume the following is ready
  * Githup repository of Sultanstrail
  * Android SDK is in place
  * node js is in place and several modules installed under which Cordova
* Create application environment
  ```
  $ cd ~/Projects/Mobile/Projects
  $ cordova create Sultanstrail io.github.martimm.sultanstrail SultansTrail
  $ cd Sultanstrail
  ```
* Add android data to this project, then build and emulate
  ```
  $ cordova platform add android
  $ cordova build android
  $ cordova emulate
  ```








<!-- References to sites and docs -------------------------->
[cdv-icons]: https://cordova.apache.org/docs/en/latest/config_ref/images.html
[on-event]: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Event_handlers
[event-listen]: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
[event-type]: https://developer.mozilla.org/en-US/docs/Web/Events
[style]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style
