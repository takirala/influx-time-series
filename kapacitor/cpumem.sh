cp /tmp/cpu_alert_temp.tick /tmp/cpu_alert.tick
chmod 777 /tmp/cpu_alert.tick
sed -i "s/variable/$1/g" /tmp/cpu_alert.tick
kapacitor define cpu_alert     -type stream     -tick /tmp/cpu_alert.tick     -dbrp <db>.autogen
