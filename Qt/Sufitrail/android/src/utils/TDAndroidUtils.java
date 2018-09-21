package utils;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;  // ok
import android.content.Intent;  // ok
import java.io.File;
import android.net.Uri;
import android.util.Log;  // ok

import android.content.ContentResolver;
import android.content.ComponentName;  // ok
import android.database.Cursor;
import android.provider.MediaStore;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.FileOutputStream;

import java.util.List;
import android.content.pm.ResolveInfo;
import java.util.ArrayList;
import android.content.pm.PackageManager;
import java.util.Comparator;
import java.util.Collections;
import android.content.Context;
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
     we take package name from manifest again and add the java package name to
     it;
     package name = io.martimm.github.HikingCompanion.utils
     class name = HCAndroidShareUtils


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

      <activity android:name=".utils">
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
  public static boolean install(String uri) {

    boolean result = false;

    if ( QtNative.activity() == null ) return result;

    Intent sendIntent = new Intent();
    sendIntent.setAction(Intent.ACTION_SEND);
    sendIntent.putExtra( Intent.EXTRA_TEXT, uri);
    sendIntent.setType("text/plain");
    sendIntent.setComponent(
      new ComponentName(
              "io.martimm.github.HikingCompanion",
              "io.martimm.github.HikingCompanion.utils.HCAndroidUtils"
              )
      );

    Log.d("TD Java object", "Send intent prepared");

    // Verify that the intent will resolve to an activity
    if ( sendIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d("TD Java object", "Start activity");

      try {
        QtNative.activity().startActivity(sendIntent);
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

  // --------------------------------------------------------------------------
  public static void start() {

    if ( QtNative.activity() == null ) return;

    Intent sendIntent = new Intent();
    sendIntent.setAction(Intent.ACTION_MAIN);
    sendIntent.setType("text/plain");
    sendIntent.setComponent(
      new ComponentName(
            "io.martimm.github.HikingCompanion",
            "org.qtproject.qt5.android.bindings.QtActivity"
            )
      );

    Log.d("TD Java object", "Start intent prepared");

    // Verify that the intent will resolve to an activity
    if ( sendIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d("TD Java object", "Start activity");

      QtNative.activity().startActivity(sendIntent);
    }

    else {
      Log.d("TD Java object", "Intent not resolved");
    }
  }
}
