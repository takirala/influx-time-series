cp /tmp/mem_alert_temp.tick /tmp/mem_alert.tick
chmod 777 /tmp/mem_alert.tick
sed -i "s/variable/$1/g" /tmp/mem_alert.tick
kapacitor define mem_alert     -type stream     -tick /tmp/mem_alert.tick     -dbrp telegraf.autogen
