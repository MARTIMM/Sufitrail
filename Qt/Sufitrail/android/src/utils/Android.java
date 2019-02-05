package utils;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;

import android.content.Intent;
import android.content.ComponentName;
import android.app.Application;
import android.util.Log;  // temporary for debugging

// ----------------------------------------------------------------------------
public class Android {
  // --------------------------------------------------------------------------
  private static String LOG_TAG = "Sufitrail Android";

  // --------------------------------------------------------------------------
  // Start with extra argruments
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

    Log.d( LOG_TAG, "Start intent prepared");

    // Verify that the intent will resolve to an activity
    if ( startIntent.resolveActivity(QtNative.activity().getPackageManager())
         != null ) {
      Log.d( LOG_TAG, "Start activity");

      QtNative.activity().startActivity(startIntent);
    }

    else {
      Log.d( LOG_TAG, "Intent not resolved");
      return false;
    }

    return true;
  }
}
