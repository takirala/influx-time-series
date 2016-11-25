# influx-time-series

### Steps to do.

#### Install InfluxDB
    curl -sL https://repos.influxdata.com/influxdb.key | sudo apt-key add -
    source /etc/lsb-release
    echo "deb https://repos.influxdata.com/${DISTRIB_ID,,} ${DISTRIB_CODENAME} stable" | sudo tee /etc/apt/sources.list.d/influxdb.list
    sudo apt-get update && sudo apt-get install influxdb
  
##### Start influx Server. 
    
    sudo service influxdb start
    
  Visit influx GUI at http://localhost:8083/  
  
##### Start influx client
  
    influx
    
  You can play around with the influx db client.
  
#### Install telegraf - The super cool data collector.  

    brew install telegraf
    or, sudo apt-get install telegraf
    
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

#### Run telegraf

    telegraf -config telegraf.conf

#### Install rvm and ruby

    \curl -sSL https://get.rvm.io | bash
    rvm install 2.2.1

#### Install sinatra gem inside the project's rvm gemset

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
