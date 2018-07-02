#!/usr/bin/env perl6

use v6;

sub MAIN ( Str:D $html-document where $_.IO ~~ :r ) {

  my Str $text = $html-document.IO.slurp;
  $text ~~ s:s/ '<' body for '=' '"' html\-export '"' '>' /<body>/;
  $html-document.IO.spurt($text);
}
