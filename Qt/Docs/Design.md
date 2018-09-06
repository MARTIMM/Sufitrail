[toc]

# Purpose of the application

The original ideas of making an app holding all data and functionality like showing a map and tracks is changed when I got stuck using HTML and Javascript with the help of Cordova. I came across a better development environment called Qt which has great support for mobile devices. Originally it was meant to build GUI applications on the desktop but is greatly improved to be used for all sorts of programs. The languages which can be used in their IDE, i.e. qtcreator, are Java, C++ and QML. Text can be plain, Smart Text or HTML. There is also translation support.

The change in application setup came when there were more hiking routes to be programmed the same way as the original, so I wanted to separate the data from the GUI and make one or more apps to hold the hiking data and one app to show it all.

The data apps will get the name of the trail. Examples are **Sultanstrail** or **Sufitrail**. The display program is called **HikingCompanion**.

The **HikingCompanion** could be extended in such a way that the user can create tracks him/herself by adding tracks, notes and photos.


# Setup of application

Because there are at least two applications, a trail data app and the **HikingCompanion** app, some sort of communication must take place before the data can be used in the **HikingCompanion**. There are several solutions but the following feels promising.

* Install the HikingCompanion.
* Use the installed app as a standalone application. Useful when features are added like saving GPS data, photos and notes.
* Install a hiking route.
* When started, the following will happen;
  * The HikingCompanion is started. This means that the program must installed before the data app is run.
  * The data is copied from the container app to the HikingCompanion app.
  * When finished, the data is not needed anymore and the track data app could be deïnstalled again.
  * In the HikingCompanion app the track is selectable on the config page.
  * After making a selection, caches of previously selected routes are cleared and new data retrieved from internet.


# Data held in the track data app

* GPX tracks to show the route.
* Map features for linking to notes and sites.
* Feature notes of interesting locations.
* Photos of places along the route.
* Theme colors to show differences between hiking trails.
* Url's to sites for hotel and restaurant booking, uploading tracks and email.
* About page information. Attribution and licenses.
* Language translation files and list of supported languages.
* An XML resources document holding information of all data.


# Details of implementation

Using information found [here][b1 share], [here][b2 share] and [here][b3 share], the following is possible (both apps, track data and HikingCompanion, are installed);
* Upon start of the track data app;
  * Show splash screen with progress bar.
  * Copy all data to an application external directory.
  * Copy the resources document to the same directory.
  * Start the HikingCompanion app with a URL pointing to the external directory.
  * Wait for ready signal of the HikingCompanion app.
  * Show final message and wait for user to press a <button>Quit</button> button.
* Upon start of the HikingCompanion;
  * Keep GUI invisible.
  * Check if url is given.
    * If not, switch GUI visibility on and continue normal operation.
  * Check resource document given by the url to see if already installed. Check for the track data app's name and its version.
    * If already installed, remove data and return ready signal and continue the operation using this trail information.
  * Copy all data into the private directories of the app.
  * Record this information to the trails administration (QSettings)
  * When done, return ready signal and continue the operation using this trail information.


<!-- references ----------------------------------------------------------- -->
[b1 share]: http://blog.qt.io/blog/2017/12/01/sharing-files-android-ios-qt-app/
[b2 share]: https://blog.qt.io/blog/2018/01/16/sharing-files-android-ios-qt-app-part-2/
[b3 share]: http://blog.qt.io/blog/2018/02/06/sharing-files-android-ios-qt-app-part-3/
[b qt android]: http://blog.qt.io/blog/2013/07/23/anatomy-of-a-qt-5-for-android-application/
[b intents android]: http://blog.qt.io/blog/2016/06/30/intents-with-qt-for-android-part-1/
[b purchase android]: http://blog.qt.io/blog/2013/12/12/implementing-in-app-purchase-on-android/
