
use strict;
use warnings;

use Time::Piece ':override';

# $dt->subtract_datetime($datetime)
use DateTime;

while (<>) {
   # 09-10-2021 16:51:01
   # 1994-11-05T08:15:30-05:00
   my $dstr = "";
   if(/\[(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)\]/) {
      my $logdt = DateTime->new(
          year       => $3,
          month      => $2,
          day        => $1,
          hour       => $4,
          minute     => $5,
          second     => $6,
          time_zone  => "Australia/Sydney",
      );
      my $nowdt = DateTime->now(time_zone => 'Australia/Sydney');
      #print $logdt . " " . $nowdt . "\n"; 

      my $delta = $nowdt->subtract_datetime($logdt);

      if ($delta->days > 0) {
        $dstr = $delta->days. "d" . $delta->hours . "h";
      } 

      elsif ($delta->hours>0) {
        $dstr = $delta->hours. "h" . $delta->minutes . "m";
      } 

      elsif ($delta->minutes>0) {
        $dstr = $delta->minutes. "m" . $delta->seconds . "s";
      } 

      else {
        $dstr = $delta->seconds . "s";
      } 

   }
   print "$dstr $_";
}


