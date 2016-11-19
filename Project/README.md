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


#### Install rvm and ruby

    \curl -sSL https://get.rvm.io | bash
    rvm install 2.2.1

#### Install sinatra gem inside the project's rvm gemset

    cd influxdb-syswatch
    gem install sinatra

#### Start sinatra server

    First, make sure that telegraf is running!
    cd influxdb-syswatch
    ruby app.rb
    Goto http://localhost:4567/
