#!/usr/bin/env perl6

use v6;

my Str $time = DateTime.now.hh-mm-ss;
my Proc $p = shell "adb logcat -e ':CONSOLE' -b main,system,crash", :out;
while $p.out.get -> $l is copy {
  $l ~~ m/^ \d+ '-' \d+ \s (\d+ ':' \d+ ':' \d+) /;
  my Str $log-time = ($/[0]//'').Str;

  # skip if it isn't a log message
  next unless ? $log-time;

  # skip if log is from before now
  next if $time gt $log-time;

  # now we can filter what we need
  $l ~~ s:s/I chromium\: '[INFO:CONSOLE(' \d+ ')]'//;
  $l ~~ s/^ \d+ '-' \d+ \s+ (\d+ ':' \d+ ':' \d+) \. \d+ \s+ \d+ \s+ \d+ \s+//;

  $l ~~ m/'source:' \s 'file://' (.*? '.js') \s \((\d+)\)/;
  my Str $source = ($/[0]//'').Str;
  my Str $basename = ? $source ?? $source.IO.basename !! '';
  my Str $line = ($/[1]//'').Str;

  $l ~~ s/source .* $//;
  $l ~~ s/\"//;
  $l ~~ s/\"\,\s+ $//;

  note "$log-time $basename $line: $l";

  last if $l ~~ m/SufiTrail \s program \s stopped/;
}
