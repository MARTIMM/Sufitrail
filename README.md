# Sufi trail hiking application

This application is used to help hikers to stroll along the trail from Istanbul to Konya. See also [the sufi trail web site][website]. The goal of the project is to create an app which should be possible to install on all types of mobile devices but is started for Android devices only.

What is stored here is only a part of the project. Everything generated from sources, SDK's and what not, is not available here. Also the app cannot be found here. Later the app can be bought from the store on the web site mentioned above.

## Privacy conciderations
The program makes use of the gps device on your tablet or phone to show the location of your position on the map. The program also can store this information on disk to create a track of where you have walked.

# Bugs
```
# ghi list --label Bug -v
#1: Hangup on android
 bug

    Hangup after a while when swiping etc. over the map. Several things need to
    be inspected; 1) versions of js libs, 2) android version, 3) cordova
    version, 4) several android config files.
```

# Changes

* 0.5.0
  * Added code to generate and show information of a track. The first track is described and the rest has a default message.
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
* 0.1.0
  * Basic page selection from a menu opening from the side.
* 0.0.1
  * Basic setup.

<!-- references -->
[website]: http://sufitrail.com/
