package utils;

import android.content.Context;
import android.content.ContentResolver;

import android.util.Log;  // temporary for debugging


// ----------------------------------------------------------------------------
public class GlobalHelper {
  // --------------------------------------------------------------------------
  private static String LOG_TAG = "Sufitrail GlobalHelper";

  private static GlobalHelper instance;
  private Context mContext;
  private ContentResolver mContentResolvert;

  // --------------------------------------------------------------------------
  private GlobalHelper(Context context) {
    if ( context == null ) {
      Log.e( LOG_TAG, "Error: context is null");
    }

    else {
      mContext = context.getApplicationContext();
    }
  }

  // --------------------------------------------------------------------------
  public static GlobalHelper getInstance(Context context) {
    synchronized(GlobalHelper.class) {
      if ( instance == null ) {
        instance = new GlobalHelper(context);
      }
      return instance;
    }
  }

  // --------------------------------------------------------------------------
  public Context getContext() {
    return mContext;
  }
}
