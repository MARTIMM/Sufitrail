package utils;

//import utils.GlobalHelper;
import org.qtproject.qt5.android.bindings.QtApplication;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;

import android.util.Log;  // temporary for debugging

import android.content.Intent;
import android.app.Application;

//import android.content.ContentProviderClient;
import android.content.ComponentName;
//import android.content.Context;
//import android.content.ContentProvider;
//import android.content.ContentResolver;
//import android.content.ContentValues;

//import android.database.MatrixCursor;
//import android.database.Cursor;

//import android.os.Parcelable;

//import android.net.Uri;
//import android.net.Uri.Builder;

//import android.os.Bundle;
//import android.os.Binder;
//import android.os.IBinder;
//import android.os.RemoteException;

//import java.io.File;
//import android.net.Uri;
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
//import android.os.Build;

// ----------------------------------------------------------------------------
public class AndroidProviderClient {
  // --------------------------------------------------------------------------
  private static String LOG_TAG = "Sufitrail AndroidProviderClient";


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

/*
// ----------------------------------------------------------------------------
public class AndroidProviderClient {
  // --------------------------------------------------------------------------
  private static String LOG_TAG = "Sufitrail AndroidProviderClient";

  // --------------------------------------------------------------------------
  //https://forum.qt.io/topic/75827/get-context-in-java-code-run-from-c/3//https://www.dev2qa.com/android-get-application-context-from-anywhere-example/
  public static boolean install( String dataRootDir, Context ctx) {

    //Uri.Builder pu = new Uri.Builder();
    String authority = "io.martimm.github.HikingCompanion.provider";
    Uri providerUri = Uri.parse("content://" + authority);
    Uri tableUri = providerUri.buildUpon().appendPath(dataRootDir).build();

    Log.d( LOG_TAG, ctx.getPackageName());
    ContentResolver cr =  ctx.getContentResolver();
    // new ContentResolver(
    //    GlobalHelper.getInstance(this).getContext()
    //    );
    ContentProviderClient cpc = cr.acquireContentProviderClient(providerUri);

    if ( cpc == null ) {
      Log.e( LOG_TAG, "No ContentProviderClient returned");
      return false;
    }

    ContentValues cv = new ContentValues();
    cv.put( "dataRootDir", dataRootDir);
    try {
      Uri result = cpc.insert( tableUri, cv);
      Log.i( LOG_TAG, "Result insert: " + result.getEncodedPath());
      if ( result.getEncodedPath() == "content://ok" ) {
        Log.i( LOG_TAG, "insert done well -> HC is installing");
      }

      else {
        Log.e( LOG_TAG, "insert failed");
      }
    }

    catch ( RemoteException e ) {
      Log.e( LOG_TAG, "Remote exception: " + e.getMessage());
    }

    cpc.close();
    return true;
  }


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

    Log.d( LOG_TAG, "Start intent prepared");

    // Verify that the intent will resolve to an activity
    if ( startIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d( LOG_TAG, "Start activity");

      QtNative.activity().startActivity(startIntent);
    }

    else {
      Log.d( LOG_TAG, "Intent not resolved");
      return false;
    }

    return true;
  }
*/



/*
  // --------------------------------------------------------------------------
  public static boolean install(String dataRootDir) {
    String uri = "content://io.martimm.github.SufiTrail.provider";
    String mProjection[] = {
      uri + "/dataRootDir/_ID",
      uri + "/dataRootDir/path",
    };
    // Defines a string to contain the selection clause
    String mSelectionClause = null;

    // Initializes an array to contain selection arguments
    String mSelectionArgs[] = {""};
    String mSortOrder = "";
    ContentResolver mcr = new ContentResolver();

    // Ask for the data
    Cursor mCursor = mcr.query(
      uri + "/dataRootDir",
      mProjection,
      mSelectionClause,
      mSelectionArgs,
      mSortOrder
      );

    // Some providers return null if an error occurs, others throw an exception
    if ( null == mCursor ) {
      // Error
      Log.e( LOG_TAG, "Error: empty cursor");

    } else if ( mCursor.getCount() < 1 ) {
      // If the Cursor is empty, the provider found no matches. In our
      // case it's an error.
      Log.e( LOG_TAG, "Error: no records");

    } else {
      Log.i( LOG_TAG, "Data from hiking container");

      // Get first and only row
      mCursor.moveToNext();

      int id = mCursor.getString(0);
      String dataRootDir = mCursor.getString(1);
      Log.i( LOG_TAG, dataRootDir + ", " + id.toString());
    }

    return true;
  }
*/
/*
  // --------------------------------------------------------------------------
  public static String[] getRowData(int rowCount) {

    String s[] = new String[2];
    s[0] = "";
    s[1] = "";
    return s;
  }
}

*/












/*
public class TDAndroidUtils {
  private static String LOG_TAG = "TD Service";

  // --------------------------------------------------------------------------
  static final int HC_INSTALL_REQUEST = 1;  // The request code
  public static boolean install(String path) {

    boolean result = false;

    if ( QtNative.activity() == null ) return result;

    Intent installIntent = new Intent();
    installIntent.setAction(Intent.ACTION_SEND);

    Bundle AB_dataShareDir = new Bundle();
    AB_dataShareDir.putCharArray( "dataShareDir", path.toCharArray());
    installIntent.putExtras(AB_dataShareDir);

    installIntent.setComponent(
      new ComponentName(
        "io.martimm.github.HikingCompanion",
        "io.martimm.github.HikingCompanion.utils.HCAndroidUtils"
      )
    );

    Log.d( LOG_TAG, "Send intent prepared");

    // Verify that the intent will resolve to an activity
    //if ( installIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d( LOG_TAG, "Start service");

      try {
        //QtNative.getApplicationContext().startService(installIntent);
        QtNative.activity().startService(installIntent);
        result = true;
      }
      catch ( Exception e ) {
        Log.d( LOG_TAG, e.getMessage());
      }

    //  return result;
    //}

    //else {
    //  Log.d( LOG_TAG, "Intent not resolved");
    //}

    return result;
  }
}
*/
