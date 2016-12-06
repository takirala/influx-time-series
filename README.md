# SysWatch
A guide to install the Syswatch tool - A web based tool to monitor system usage.

* Implemented a web based system monitor tool.
* Configured telegraf which is a data collector tool to collect usage data from system.
* Using the light weight MQTT protocol, telegraf stores data in to the influxdb.
* The time series database (influxdb) stores various kinds of data about RAM, CPU, Disk & Networking. 
* InfluxDB performs aggregation queries down-sampling the data to create insights into system usage. It uses Holt-Winters prediction to gain insights into future usage.
* A light-weight web container based on Sinatra (Ruby) hosts a frontend developed using Rickshaw.js & d3.js to visualize the usage data.
* User can configure and receive alerts via email or text.
* Demo @ https://www.youtube.com/watch?v=FjyBzEOx4VY

## Architecture of SysWatch

![Architecture](/Architecture.png)


### Steps to do.

#### Install InfluxDB
    curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
    source /etc/lsb-release
    echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
    sudo apt-get update && sudo apt-get install influxdb
    
*Alternatively, you can compile your own influxdb from binary for added flexibility*

    Follow guide at : 
    https://anomaly.io/compile-influxdb/

##### Start influx Server. 
    
    sudo service influxdb start
    
  Visit influx GUI at http://localhost:8083/  
  
##### Start influx client
  
    influx
    
  You can play around with the influx db client.
  
#### Install telegraf - The super cool data collector.  
  
    sudo apt-get install telegraf
    telegraf
    
  By default, it will start collecting all the cpu metrics and will write that to influxdb in a database called telegraf. Below is the list of measurements you should see.

      measurements
        name
        cpu
        disk
        diskio
        kernel
        mem
        processes
        swap
        system



#### Generate telegraf config file

    telegraf.conf file is already present in the `telegraf` dir of the repo

#### Run telegraf

    telegraf -config telegraf.conf

#### Install rvm and ruby

    \curl -sSL https://get.rvm.io | bash
    rvm install 2.2.1

#### Install gems inside the project's rvm gemset

    cd influx-time-series/Project
    gem install sinatra
    gem install twilio-ruby

#### Start sinatra server

    First, make sure that telegraf is running!
    cd influx-time-series/Project
    ruby app.rb
    Goto http://localhost:4567/

#### Install kapacitor

    brew install kapacitor

    For other systems, https://www.influxdata.com/downloads/#kapacitor

#### Generate kapacitor config file

    kapacitor.conf file is already present in the `kapacitor` dir of the repo

#### Run kapacitor

    cd influx-time-series/kapacitor
    kapacitord -config kapacitor.conf

#### Set kapacitor alerts

    Copy all .tick and .sh files in influx-time-series/kapacitor to /tmp dir

    kapacitor define mem_alert -type stream -tick /tmp/mem_alert.tick -dbrp telegraf.autogen
    kapacitor enable mem_alert

    kapacitor define cpu_alert -type stream -tick /tmp/cpu_alert.tick -dbrp telegraf.autogen
    kapacitor enable cpu_alert

    Goto http://localhost:4567/alerts and set alert thresholds for mem and cpu

    Alerts will start appearing on the /alerts page!

#### Disable kapacitor alerts

    kapacitor disable mem_alert
    kapacitor disable cpu_alert
    
For grafana based dashboards, where in users can enter their desired queries, follow the below process:

#### Install grafana 

Refer http://docs.grafana.org/installation/debian/


    wget https://grafanarel.s3.amazonaws.com/builds/grafana_3.1.1-1470047149_amd64.deb
    sudo apt-get install -y adduser libfontconfig
    sudo dpkg -i --force-overwrite grafana_3.1.1-1470047149_amd64.deb
    
##### Start grafana

    sudo service grafana-server start

### Resources

https://www.influxdata.com/building-custom-interfaces-for-influxdb/
