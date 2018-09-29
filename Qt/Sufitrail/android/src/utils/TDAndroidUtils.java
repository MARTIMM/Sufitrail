package utils;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;  // ok
import android.content.Intent;  // ok
//import java.io.File;
//import android.net.Uri;
import android.util.Log;  // ok

//import android.content.ContentResolver;
import android.content.ComponentName;  // ok
//import android.database.Cursor;
//import android.provider.MediaStore;
//import java.io.FileNotFoundException;
//import java.io.IOException;
//import java.io.InputStream;
//import java.io.FileOutputStream;

//import java.util.List;
//import android.content.pm.ResolveInfo;
//import java.util.ArrayList;
//import android.content.pm.PackageManager;
//import java.util.Comparator;
//import java.util.Collections;
//import android.content.Context;
import android.os.Parcelable;  // ok

import android.os.Build;

/*

  ComponentName( package, class)
  Take package name from the android manifest package element of the target
  where the action is directed to.

  For the class name, take the name from the action which must be performed


  E.g.
  1) Start the HikingCompanion app from another app;
     package name = io.martimm.github.HikingCompanion
     class name = org.qtproject.qt5.android.bindings.QtApplication
  2) If we want to send data to another java method in the HikingCompanion app
     we take the package name from manifest again and add the java package name
     to it (depend on how it is defined in the activity);
     package name = io.martimm.github.HikingCompanion
     class name = io.martimm.github.HikingCompanion.utils.HCAndroidUtils


  For all this to work the manifest must have an activity defined like this;
  <manifest package="io.martimm.github.HikingCompanion" ...>
    <application ...>
      <activity android:name="org.qtproject.qt5.android.bindings.QtApplication">
        <intent-filter>
          <action android:name="android.intent.action.MAIN"/>
          <category android:name="android.intent.category.LAUNCHER"/>
          <data android:mimeType="* /*"/>
        </intent-filter>
        ...
      </activity>
      ...

      <activity android:name=".utils.HCAndroidUtils">
        <intent-filter>
          <action android:name="android.intent.action.SEND"/>
          <category android:name="android.intent.category.DEFAULT"/>
          <data android:mimeType="* /*"/>
        </intent-filter>
        ...
      </activity>
      ...
    </application>
  <manifest>
*/

// ----------------------------------------------------------------------------
public class TDAndroidUtils {

  // --------------------------------------------------------------------------
  static final int HC_INSTALL_REQUEST = 1;  // The request code
  public static boolean install(String path) {

    boolean result = false;

    if ( QtNative.activity() == null ) return result;

    Intent installIntent = new Intent();
    //installIntent.setAction(Intent.ACTION_MAIN);
    installIntent.setAction(Intent.ACTION_SEND);
    installIntent.putExtra( "io.martimm.github.Sufitrail.install", url);
    installIntent.setComponent(
      new ComponentName(
        "io.martimm.github.HikingCompanion",
        "io.martimm.github.HikingCompanion.utils.HCAndroidUtils"
//        "org.qtproject.qt5.android.bindings.QtActivity"
      )
    );

    Log.d("TD Java object", "Send intent prepared");

    // Verify that the intent will resolve to an activity
    if ( installIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d("TD Java object", "Start activity");

      try {
//        QtNative.activity().startActivityForResult( installIntent, HC_INSTALL_REQUEST);
        QtNative.activity().startActivity(installIntent);
        result = true;
      }
      catch ( Exception e ) {
        Log.d("TD Java object", e.getMessage());
      }

      return result;
    }

    else {
      Log.d("TD Java object", "Intent not resolved");
    }

    return result;
  }
/*
  // --------------------------------------------------------------------------
  @override
  protected void onActivityResult(
    int requestCode, int resultCode, Intent data
    ) {

    // Check which request we're responding to
    if ( requestCode == HC_INSTALL_REQUEST ) {
      // Make sure the request was successful
      if ( resultCode == RESULT_OK ) {
        Log.d("Android install returned ok");
      }

      else {
        Log.d("Android install returned not ok");
      }
    }
  }
*/
  // --------------------------------------------------------------------------
  public static boolean start() {

    if ( QtNative.activity() == null ) return false;

    Intent startIntent = new Intent();
    startIntent.setAction(Intent.ACTION_MAIN);
    startIntent.setType("text/plain");
    startIntent.setComponent(
      new ComponentName(
            "io.martimm.github.HikingCompanion",
            "org.qtproject.qt5.android.bindings.QtActivity"
            )
      );

    Log.d("TD Java object", "Start intent prepared");

    // Verify that the intent will resolve to an activity
    if ( startIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d("TD Java object", "Start activity");

      QtNative.activity().startActivity(startIntent);
    }

    else {
      Log.d("TD Java object", "Intent not resolved");
      return false;
    }

    return true;
  }
}
