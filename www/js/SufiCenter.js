/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
"use strict";

// =============================================================================
var SufiCenter = {

  view:             SufiMap,
  model:            SufiData,

  menu:             null,
  networkOnline:    false,

  // ---------------------------------------------------------------------------
  init: function ( mapElementName, menuObject ) {

    // must be set first: init's might refer to it
    this.menu = menuObject;

    // check for online
    this.checkNetworkState();
    window.addEventListener(
      'offline', function ( ) { SufiCenter.checkNetworkState(); }
    );
    window.addEventListener(
      'online', function ( ) { SufiCenter.checkNetworkState(); }
    );

//console.log(this.networkOnline);
    this.view.init( this, mapElementName);
    this.model.init(this);
  },

  // ---------------------------------------------------------------------------
  checkNetworkState: function ( ) {
    this.networkOnline = navigator.onLine;
  }
}

// this way we keep dependencies only to this spot
SufiCenter.init( "SufiTrailMap", menu);
