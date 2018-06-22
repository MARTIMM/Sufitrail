/*
    Author: Marcel Timmerman
    License: ...
    Copyright: © Sufitrail 2017, 2018
*/
"use strict";

/**
 * @fileoverview
 */

goog.provide('SufiTrail.StartApp');
goog.require('SufiTrail.SufiCenter');

/** ============================================================================
  @final
  @constructor
*/
SufiTrail.StartApp = function ( ) {
  this.center = null;
}

SufiTrail.StartApp.prototype.start = function ( ) {
  this.center = new SufiTrail.SufiCenter();
  this.center.init();
}

/**
  @const
*/
var starter = new SufiTrail.StartApp();
starter.start();
