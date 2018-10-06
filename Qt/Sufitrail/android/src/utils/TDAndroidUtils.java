package utils;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;

import android.util.Log;  // temporary for debugging

import android.content.Intent;
import android.content.ComponentName;
import android.content.Context;
import android.content.ContentProvider ;
import android.content.ContentResolver;

import android.database.MatrixCursor;
import android.database.Cursor;

import android.os.Parcelable;

//import android.os.Bundle;
//import android.os.Binder;
//import android.os.IBinder;

//import java.io.File;
//import android.net.Uri;
////import android.database.Cursor;
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
//import android.os.Build;


// ----------------------------------------------------------------------------
public class TDAndroidUtils extends ContentProvider {

  // --------------------------------------------------------------------------
  private static String LOG_TAG = "Sufitrail TDAndroidUtils";

  private static MatrixCursor _dataPathOnly = new MatrixCursor(["path"]);

  // --------------------------------------------------------------------------
  // Defined in the main.cpp file as an entry into the c++ code
  public static native String getDataRootDir();

  // --------------------------------------------------------------------------
  @Override
  public void onCreate ( ) {
    super.onCreate();
    Log.v( LOG_TAG, "in onCreate");
  }

  // --------------------------------------------------------------------------
  @Override
  public Cursor query (
    Uri uri,
    String[] projection,
    Bundle queryArgs,
    CancellationSignal cancellationSignal
  ) {
    Log.v( LOG_TAG, "in query");

    // Place data in dataRootDir
    TDAndroidUtils.moveDataPublic();

    // Then setup the row in the table (one column in one row) holding
    // the path to this data
    if ( dataPathOnly.getCount() == 0 ) {
      dataPathOnly.addRow([TDAndroidUtils.getDataRootDir()]);
    }

    return dataPathOnly;
  }

  // --------------------------------------------------------------------------
  @Override
  public Uri insert (
    Uri uri,
    ContentValues values
  ) {
    Log.v( LOG_TAG, "in insert, ignored");
    return null;
  }

  // --------------------------------------------------------------------------
  @Override
  public int update (
    Uri uri,
    ContentValues values,
    String selection,
    String[] selectionArgs
  ) {
    Log.v( LOG_TAG, "in update, ignored");
    return null;
  }

  // --------------------------------------------------------------------------
  @Override
  public int delete (
    Uri uri,
    String selection,
    String[] selectionArgs
  ) {
    Log.v( LOG_TAG, "in delete, ignored");
    return null;
  }

  // --------------------------------------------------------------------------
  @Override
  public String getType ( Uri uri ) {
    return "plain/text";
  }

  // --------------------------------------------------------------------------
  @Override
  public String getStreamTypes ( Uri uri ) {

  }
}











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

    Bundle AB_dataRootDir = new Bundle();
    AB_dataRootDir.putCharArray( "dataRootDir", path.toCharArray());
    installIntent.putExtras(AB_dataRootDir);

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
}
*/
