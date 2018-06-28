# Sufi trail hiking application

This application is used to help hikers to stroll along the trail from Istanbul to Konya. See also [the sufi trail web site][website]. The goal of the project is to create an app which should be possible to install on all types of mobile devices but is started for Android devices only.

What is stored here is only a part of the project. Everything generated from sources, SDK's and what not, is not available here. Also the app cannot be found here. Later the app can be bought from the store on the web site mentioned above.

## Privacy conciderations
The program makes use of the gps device on your tablet or phone to show the location of your position on the map. The program also can store this information on disk to create a track of where you have walked.

# Todo
This is a list of more or less implemented items which need more attention. The rest is unimplemented or done and ok.

* Geolocation testing. Must do it outside because buildings shields off a lot.
* Move menu buttons on pages to the right
* Move menu button on home page a bit lower. It overlaps north-button

* Must find a new way to read/write files. It is very cumbersome to get things done using the File API. It is supported using a cordova plugin. Outside of this plugin, the File API is abandoned by the W3C for whatever reason. So, going back to google closure perhaps, which supports the File API too with a few more tools to handle directories and such. There is also a mention in OpenLayers that it is using it.

# Bugs
```
# ghi list --label Bug -v
```

# Changes

* 0.10.0
  * Improved splashscreen
  * Created a program to generate a javascript caching module `SufiTrail.SufiCacheData`. In this module an object is generated with all the tile coordinates at several zoom levels. This data is created using the gpx track where all the longitude/latitude coordinates are stored for the total hiking route. Now this module can be inherited by another module to implement functions which use the data from the generated module.
  * Added module `SufiTrail.SufiCache` to inherit from `SufiTrail.SufiCacheData`.
* 0.9.0 Splash screen
* 0.8.1 Modified the standard cordova icon with a sufi-poppetje.
* 0.8.0 A dashed line is shown from current location to closest point on the track to show that the hiker wanders off route.
* 0.7.0 Geolocation works and shows a blue circle at the current location.
* 0.6.0
  * Added the exit button
  * Hangup bug seems to have gone. (newer versions of cordova and android (SDK etc) perhaps)
* 0.5.0 Added code to generate and show information of a track. The first track is described and the rest has a default message.
* 0.4.0
  * Total track split in 41 pieces and made visible.
  * Extracted way points from track, however it does not seem usable. Must get way points from OSM.
* 0.3.0
  * Javacript file split in several modules.
  * Added an observer/producer module.
  * Total track is visible.
* 0.2.0
  * Map is visible.
  * Map and buttons adapt to several screen sizes and changes.
* 0.1.0 Basic page selection from a menu opening from the side.
* 0.0.1 Basic setup.

<!-- references -->
[website]: http://sufitrail.com/
