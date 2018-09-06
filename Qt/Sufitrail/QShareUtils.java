// ----------------------------------------------------------------------------
public static boolean share( String text, String url) {

    if ( QtNative.activity() == null ) return false;

    Intent sendIntent = new Intent();
    sendIntent.setAction(Intent.ACTION_SEND);
    sendIntent.putExtra( Intent.EXTRA_TEXT, text + " " + url);
    sendIntent.setType("text/plain");

    // Verify that the intent will resolve to an activity
    if ( sendIntent.resolveActivity(QtNative.activity().getPackageManager()) != null ) {
        QtNative.activity().startActivity(sendIntent);
        return true;

    } else {
        Log.d("ekkescorner share", "Intent not resolved");
    }

    return false;
}
