[toc]

# Planning and Progress Document

## Purpose of the document
Purpose of this document is to make a record of requirements and to show which of the requirements are implemented, which are not implemented yet or even not feasible.

Communication will be done by sending this document from time to time to the contacts after which there will be some comments, additions, changes or removals. This will be made visible later in this document in the design and planning.


# Requirements

## Purpose of the application

The application helps the user to find his/her way on a trail called the Sufi trail. This is a route between Istanbul to Konya. The GPS on the devices is used to show the location of the user and to create a track for the hiker.

### What OS and device types the app must run on
<progress value="4" max="8" />

* Android. This will be the first target.
  * [x] Android SDK. This piece of software and toolbox is needed between the App and the device.
  * [x] Cordova. Is needed to embed the App written in HTML and JavaScript in such a way that it can use the SDK of Android to access the device.
* IOS. This os is for Apple devices.
  * [ ] IOS SDK. This will prove difficult because for the SDK to work it needs an apple operating system.
  * [x] Cordova. Is needed to embed the App written in HTML and JavaScript in such a way that it can use the SDK of IOS to access the device.
* Windows. Totally unsure how to implement this.
* Linux on a desktop computer. This is necessary to develop the application for layout and other html/css things.
  * [ ] Cordova using the browser device type.
  * [ ] Many of the device specific items can not be used. Therefore proper testing of these must be done. This comes in handy when some mobile device does not have the ability the program wants to use.
* Mobile device types
  * [ ] Tablets of several sizes.
  * [ ] Mobile phones of several sizes.

### Build script

Cordova and android has several ways to build the App and to install the App on the device. However, it is also necessary to think about speed and footprint. One solution is to use the google compiler to make the code smaller. A build script is needed to be able to switch between a debug version and release version.

<progress value="6" max="7" />

* [x] Lower the number of references to javascript programs from index.html to decrease load time.
* Build script
  [x] Make a debug version leaving all files separated
  [x] Make a release version which involves compiling the program.
* To make a release version, compress footprint of javascript programs.
  * [x] Generate a dependency list of all code involved and place in a file
  * [x] Use the google closure compiler and generate a compressed version using the file above.
  * [x] Sign the release version to make the program appstore worthy.
  * [ ] Upload the app to the apstore.

### Events and devices to listen to
<progress value="4" max="7" />

There are several events which occur upon changing conditions in a device. These events must be captured for further actions.
* [ ] Battery condition to warn user of battery low state. App might dim display or other options to save energy.
* [x] Gps information to get current location.
* [x] Network on and off line mode to update map and feature cache as well as send user data to a server
* [x] Device compass to show map correctly pointing the map-north to the real north.
* [x] Resize events to change from portrait to landscape mode and back. Responsive. Needed to display everything in proper sizes.
* [ ] Camera o add a picture as a point on the map when saved.
* [ ] Time and clock.

### Caching

Caching of data is needed for those moments that there is no network available.

<progress value='0' max='6' />

* [ ] At startup and network is on, caching must take place.
* [ ] Make caching process visible when cache is empty. Otherwise refresh only.
* [ ] Make a list of tile coordinates needed to cache at several zoom levels. Make estimation of total size.
* [ ] Generate a cache javascript program and place in SufiTrail namespace. This module must be capable of caching all sorts of data.
* [ ] Cache features too.
* [ ] Try to get weather forecast and cache this information too

# What the application must do
* When starting the program, the app must show a splash screen with the sufitrail emblem on it while the program gets ready in the background. Let the splash screen be shown for at least 5 seconds or longer as needed.
* When the program is initialized it must show the map of the current location using the gps information of the device. One of the buttons shown on the screen can open a menu and direct the user to other pages of the program.

# The pages of the application
A series of screen descriptions the application can show.

## Display on tablet screen
<progress value="0" max="2" />

* [ ] An icon of the sufitrail guy with green field in the back must be shown.
      <img src="../Data/Images/logo-met-groen-klein-1.png"/>
* [ ] A widget showing small part of a chart?

## Splash screen
<progress value="1" max="2" />

A splash screen is always nice to display information in such a way that it makes a connection between the hiking and biking literature published by the Sufi trail group. The other purpose is that the application can start in the background and when it is ready, the splash screen is removed.

  * [x] Show a screen with a Sufi trail icon. Keep this displayed until everything is initialized. This provides for a better user experience.
  * [ ] Image must be made complete with some text

### The Menu
<progress value="0" max="2" />

Pressing the menu button ☰ shown on the map, will open a pane from the side to show a menu of options. A click on an entry will show a page. Each page may have a shortcut to the home page: **Map** next to a menu button. When selecting an entry, the menu is closed and a page will appear.

  * [ ] Layout of menu.
  * [ ] Layout of all pages must be coherent and matching the pages and colors from the book.

####  The pages to select from the menu

  * **Map**: Show map.
  * **Info**: Show route information
  * **Tracks**: Select a track.
  * **Feature** Show history, or other info.
  * **Start**: Record your track data.
  * **Config**: Configuration of user and program data.
  * **About**: Show a page with version, people and contacts.
  * **Exit**: Close the application.

## Start page
<progress value="10" max="14" />

The map page is the home page named **Map** below in the list of menu entries. On this page the following is shown;

  * Map. The map is displayed over the full width and height of the device.
    * [x] Map displayed, move around with swipe.
    * [x] Map should fill page automatically.
    * [x] Map, Menu and buttons must be adjusted when device is rotated.
    * [ ] Show features for starting scale of map.
    * [ ] Map layer for hightlines and/or shades
    * [x] Show current location.
    * [x] A dashed line is shown from urrent location to closest point on the track to show that the hiker wanders off route.
  * Zoom buttons. The buttons are placed on the left side.
    * [x] zooming with buttons.
    * [x] zooming by pinching (on mobile device).
    * [ ] Reveal more features when zooming in.
    * [ ] Remove features when zooming out.
  * North arrow button on the top right side.
    * [x] Click action aligns map to the north.
  * Open menu button ☰. Button is placed just below the north arrow.
    * [x] Click action shows the menu on the right side of the page.
  * Open street map attribute on the bottom right of the map.
    * [x] OSM attribution is displayed.

## The info page
<progress value="1" max="1" />

  The info page shows information of the currently selected track. There are 40 tracks to walk in 40 days so we need 40 pages of data. The info page is loaded from a file from the `www/info` directory when a track is selected.

  * [x] Fill the info page after selecting a track. Previous data must be removed.

#### The information pages for each track
<progress value="1" max="40" />

  The following pages must have some info
  * [x] 01 Istanbul City
  * [ ] 02 Yalova Gökçedere
  * [ ] 03 Gökçedere Güneyköy
  * [ ] 04 Güneyköy Orhangazi
  * [ ] 05 Orhangazi Çakırlı
  * [ ] 06 Çakırlı Mahmudiye
  * [ ] 07 Mahmudiyei İznik
  * [ ] 08 Iznik Bereket
  * [ ] 09 Bereket Osmaneli
  * [ ] 10 Osmaneli Vezirhan
  * [ ] 11 Vezirhan Bilecik
  * [ ] 12 Bilecik Küre
  * [ ] 13 Küre Sögüt
  * [ ] 14 Sögüt Yeşilyurt
  * [ ] 15 Yeşilyurt Alınca
  * [ ] 16 Alınca Eskişehir
  * [ ] 17 Eskişehir Süpüren
  * [ ] 18 Süpüren Sarayören
  * [ ] 19 Sarayören Seyitgazi
  * [ ] 20 Seyitgazi Sükranlı
  * [ ] 21 Sükranlı Ağlarca
  * [ ] 22 Ağlarca Muratkoru
  * [ ] 23 Muratkoru Gömü
  * [ ] 24 Gömü Emirdağ
  * [ ] 25 Emirdag Karacalar
  * [ ] 26 Karacalar Emirdede Tepesi
  * [ ] 27 Emirdede Tepesi Kemerkaya
  * [ ] 28 Kemerkaya Taşağıl
  * [ ] 29 Taşağıl Çay
  * [ ] 30 Çay Yakasenek
  * [ ] 31 Yakasenek Ulupinar
  * [ ] 32 Ulupinar Akşehir
  * [ ] 33 Akşehir Çakırlar
  * [ ] 34 Çakırlar Doganhisarn
  * [ ] 35 Doganhisar Aşağı Çığıl
  * [ ] 36 Aşağı Çığıl Derbent
  * [ ] 37 Derbent Salahattin
  * [ ] 38 Basarakavak Küçükmuhsine
  * [ ] 39 Küçükmuhsine Sille
  * [ ] 40 Sille Konya


## The Tracks page
<progress value="6" max="6" />

  * [x] Generate the page from the directory contents and the gpx track name found in those files.
  * [x] Show map when a selection is made.
  * [x] The route is displayed.
  * [x] The route is centered on page. This depends if information is available in the user track.
  * [x] The route is zoomed so as to fit the page. This depends if information is available in the user track.
  * [x] Show dashed line from current location to closest point on the trail when off trail (further than, lets say, 1 kilometer).

## The Features page
The Features page is filled when a feature is clicked. First a balloon is showed on the map pointing to the feature with text and a 'more ...' on the bottom.

<progress value="0" max="6" />

  * Selection of features to show;
    * [ ] Restaurant - reservation information and facility
    * [ ] Hotel etc - booking information and facility
    * [ ] Mosque - historic background
    * [ ] City, village - historic background, city elders contact info, etc.
  * [ ] Show balloon with info
  * [ ] Show extra info on info page

## The Config page

<progress value="0" max="3" />

  * [ ] Text message about users consent of sending data to server
  * [ ] Username
  * [ ] Email addresses

## The Start page
This is a page where a gps track can be started.

<progress value="5" max="8" />

* [x] Start tracking
* Stop and save tracking
  * [x] Convert coordinates into gpx XML text
  * [x] Save text into file
  * [ ] Display track in a list
  * [ ] Show track on screen
  * [ ] Keep on disk after reinstall/update
* [x] Postpone tracking
* [x] Continue tracking

## The About page
This is an overview of people involved and their tasks. Also other info can be shown such as a version number.

<progress value="2" max="3" />

  * [x] Show the members of the Sufi trail group.
  * [x] Show current version of the program.
  * [ ] Read version number from elsewhere, e.g. android manifest, and insert it when generating the html from sxml.

## The Exit page
This should show a dialog to ask the user if he/she really wants to quit the program.

<progress value="1" max="4" />

  * [ ] Show quit dialog
  * [ ] Recorded track must be saved if still unsaved.
  * [x] Exit program.
  * [ ] Keep program active in background.

# Other items or problems to think about

<progress value="0" max="8" />

  * [ ] Color mapping must match that of the maps printed on paper.
  * [ ] Add ability to choose other color maps for visual impaired or color blind people.
  * [ ] By what license should the project be protected
  * [ ] Privacy considerations

# Track data
The app uses gpx data from a file to read track information. It is shown and zoomed in on it when first loaded. These gpx files must be edited (by a separate program) to add some data in the `metadata` section of the gpx file.

<progress value="17" max="18" />

* [x] Program to make the calculations and store in gpx file: `gpx-edit.pl6`. It makes use of module Tracks.pm6.
* [x] Program `convert-all-tracks.pl6` to find all gpx files from `./Data/Tracks original` and call `gpx-edit.pl6` for each file found. The results are saved in `./www/tracks`.
* [x] The program `gpx-edit.pl6` calculates minimum and maximum of longitude and latitude and stores it in the xpath `/gpx/metadata/bounds`.
* The program also stores other data in the xpath `/gpx/metadata` of the gpx file.
  * [x] `name`; filename without '.gpx' and punctuation replaced by spaces.
  * [x] `desc`; **hiking routes from Istanbul to Konya**.
  * [x] `author`; **Sufi trail**.
  * [x] `copyright`; **Sufi trail**.
  * [x] `link` reference; **http://www.sufitrail.com/**. Its link text is **Sufi Trail Hike**.
  * [x] `time`; date and time of conversion.
  * [x] `keywords`; **hike**, **Konya**, **Istanbul** and some others taken from the filename.
  * [x] `bounds`; (mentioned above). It is set if it is not available. When found, it is not overwritten. This is how Garmin uses it!
  * `extensions` field is not used.

* [x] Remove all spaces between elements thereby making the gpx file smaller.
* Other wishes.
  * [x] Convert tracks one by one.
  * [ ] Compress the track to a smaller format to make the payload smaller.
  * [x] Sufi track is in one gpx file. Need to split them up to have a smaller footprint, especially when more features are put into the gpx as waypoints.
  * [x] Extract the waypoints from the sufi track gpx file into separate file.
  * [x] Extract separate tracks from the total sufi trail
  * [x] Adjust program to check for the Garmin way of storing boundaries and if not there use the same format.

# Todo
* Move buttons on other pages to the left side, same as where it is on map.
* A button on map to go to the current location when far from track.
* Use the same button to go back to the track when hiker is far from current location.

# Bugs


# Contacts from Sultanstrail

|Name|Email|Notes|
|----|-----|-----|
| Sedat Çakir | sufitrail@gmail.com | Project leader
| Iris Bezuijen | sufitrail@gmail.com | Web master
| Rob Polko | rob@sultanstrail.nl | Map design
| Tine Lambers | | Office Manager
| Merel van Essen | | Writer of handbook
| Pijke Wees | pijkev@hotmail.com | Cartographer
| Marcel Timmerman | mt1957@gmail.com | Application builder
