1) Create an alert script
2) run - kapacitor define <some>_alert  -type stream -tick <path_to_alert_script> -dbrp <dbname>.autogen
3) enable the above alert - kapacitor enable <some>_alert

To enable email notification:
1) enable smtp settings in kapacitor.conf
