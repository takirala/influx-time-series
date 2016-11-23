1) Create an alert script in path /tmp/some_alert.tick
2) run - kapacitor define <some>_alert  -type stream -tick <path_to_alert_script> -dbrp <dbname>.autogen
3) enable the above alert - kapacitor enable <some>_alert

To enable email notification:
1) enable smtp settings in kapacitor.conf

To be able to set the limits from ui
1) copy scripts to /tmp/some_alert_temp.tick 
2) put "variable" instead of hard coded values.
3) copy runmem.sh/runcpu.sh to /tmp and change the database values inside

