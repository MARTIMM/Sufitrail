package utils;

import org.qtproject.qt5.android.QtNative;

import java.lang.String;
import android.content.Intent;
import java.io.File;
import android.net.Uri;
import android.util.Log;

import android.content.ContentResolver;
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
import android.os.Parcelable;

import android.os.Build;

//import android.support.v4.content.FileProvider;
//import android.support.v4.app.ShareCompat;

// ----------------------------------------------------------------------------
public class AndroidShareUtils
{
  public static boolean share(String url) {

    if ( QtNative.activity() == null ) return false;

    Intent sendIntent = new Intent();
    sendIntent.setAction(Intent.ACTION_SEND);
    sendIntent.putExtra( Intent.EXTRA_TEXT, url);
    sendIntent.setType("text/plain");

    // Verify that the intent will resolve to an activity
    if ( sendIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
        QtNative.activity().startActivity(sendIntent);
        return true;

    } else {
        Log.d("Java share object", "Intent not resolved");
    }

    return false;
  }
}
