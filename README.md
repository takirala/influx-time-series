# influx-time-series
A hands on tutorial to get started with influx DB


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


#### Install grafana 

Refer http://docs.grafana.org/installation/debian/


    wget https://grafanarel.s3.amazonaws.com/builds/grafana_3.1.1-1470047149_amd64.deb
    sudo apt-get install -y adduser libfontconfig
    sudo dpkg -i --force-overwrite grafana_3.1.1-1470047149_amd64.deb
    
##### Start grafana

    sudo service grafana-server start
    
##### Add a dashboard for influxdb cpu metrics

Refer http://docs.grafana.org/datasources/influxdb/


### Install GO

https://github.com/golang/go/wiki/Ubuntu


### Compile INFLUX DB

https://anomaly.io/compile-influxdb/


### Resources

https://www.influxdata.com/building-custom-interfaces-for-influxdb/
