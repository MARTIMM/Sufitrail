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
https://stackoverflow.com/questions/24838476/package-name-class-name-of-facebook-app

add Package name of your application in Package Name Field add Activity Name in Class
Name Field. Like You have com.example.facebook as your package name . In that package
you have many Activity but you want to use Facebook Code in FbExampleActivity then
FbExampleActivity is your Class Name.
*/

// ----------------------------------------------------------------------------
public class AndroidShareUtils
{
  public static boolean share(String uri) {

    if ( QtNative.activity() == null ) return false;

    Intent sendIntent = new Intent();
    sendIntent.setAction(Intent.ACTION_SEND);
    sendIntent.putExtra( Intent.EXTRA_TEXT, uri);
    sendIntent.setType("text/plain");
    sendIntent.setComponent(
      new ComponentName(
              "io.martimm.github.HikingCompanion",
              "org.qtproject.qt5.android.bindings.QtApplication"
              )
      );

    Log.d("Java share object", "Send intent prepared");

    // Verify that the intent will resolve to an activity
    if ( sendIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
      Log.d("Java share object", "Start activity");

      QtNative.activity().startActivity(sendIntent);
      return true;
    }

    else {
      Log.d("Java share object", "Intent not resolved");
    }

    return false;
  }
}
