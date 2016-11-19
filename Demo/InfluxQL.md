
### Nagapandu Potti


InfluxDB is easy to install and has no external dependencies,

	brew install influxdb
	
Firstly, let us go through some of the queries that InfluxQL, the query language for InfluxDB supports!

Line Protocol
Measurement, tag_set                              field_set timestamp
Stock_price, ticket=A, market=NASDAQ price=177.03 144529920000

Writing Data into influxDB using the CLI (one of the options to write to the database)
Creating a database

CREATE DATABASE mydb

It returns nothing if database creation is successful.

Verify that it is created –

SHOW databases

https://docs.influxdata.com/influxdb/v1.0/troubleshooting/statistics/
InfluxDB also writes statistical and diagnostic information to database named_internal, which records metrics on the internal runtime and service performance. The _internal database can be queried and manipulated like any other InfluxDB database.

Using the database we just created –

use mydb

Inserting data into the database

INSERT cpu,host=serverA,region=us_west value=0.64
INSERT payment,device=mobile,product=Notepad,method=credit billed=33,licenses=3i 1434067467100293230
INSERT stock,symbol=AAPL bid=127.46,ask=127.48
INSERT temperature,machine=unit42,type=assembly external=25,internal=37 1434067467000000000

Notice that CLI doesn’t return anything if data is inserted successfully.

To see that the data is inserted successfully,

Select * from cpu

To know more information about schema shape, you may run
Show measurements, show tag keys, show field keys

Writing Data into influxDB using the HTTP API (Second option to write to the database)

Create database

curl -i -XPOST http://localhost:8086/query --data-urlencode "q=CREATE DATABASE mydb1"

Write the data

curl -i -XPOST 'http://localhost:8086/write?db=mydb1' --data-binary 'cpu_load_short,host=server01,region=us-west value=0.64 1434055562000000000'

Querying the data

curl -GET 'http://localhost:8086/query?pretty=true' --data-urlencode "db=mydb1" --data-urlencode "q=SELECT \"value\" FROM \"cpu_load_short\" WHERE \"region\"='us-west'"

Import data into the InfluxDB
// curl https://s3-us-west-2.amazonaws.com/influx-sample-data/NOAA.txt > NOAA_data.txt

influx –import –path=NOAA_data.txt

influx

USE NOAA_water_database

precision rfc3339  (to print time stamp in human readable format)

Using Meta Queries

Show Series

Basic Queries
Select * from average_temperature where location='santa_monica' LIMIT 10

Select statement with Relative Time –

Select * from h2o_pH where time > now() - 400d LIMIT 5

Select statement with Absolute Time –

Select * from h2o_pH where time > '2015-08-18 23:00:01.232000000' LIMIT 2

Similarly, you have group by  clause.
You can also run queries with multiple functions in the same query!

---


## Influx QL

#### Set up data and database

Open webinterface at

	http://localhost:8083


Download dummy data
    
    curl https://s3-us-west-1.amazonaws.com/noaa.water.database.0.9/NOAA_data.txt > NOAA_data.txt


Write dummy data to the database.

	influx -import -path=NOAA_data.txt -precision=s


#### Database management

	CREATE RETENTION POLICY what_is_time ON NOAA_water_database DURATION 1d REPLICATION 1


#### Test Queries

	SHOW measurements

	SHOW series

	SHOW queries


Count the number of non-null values of water_level in h2o_feet:
	
	SELECT COUNT(water_level) FROM h2o_feet

Select the first five observations in the measurement h2o_feet:
	
	SELECT * FROM h2o_feet LIMIT 5


#### Insert data

Insert new data in to influx DB

	INSERT h2o_feet,location=gainesville water_level=20,level\ description="alberta measured it to be 200mm"


Select the above 
	
	SELECT *  from h2o_feet where location='gainesville'

### Influx DB Functions

#### Aggregation operators

	Monthly data from 08/18 to 09/18

	SELECT MAX(water_level) from h2o_feet
	
	SELECT MIN(water_level) from h2o_feet

	SELECT COUNT(water_level) FROM h2o_feet

	SELECT COUNT(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(4d)

	SELECT MEAN(water_level) from h2o_feet

	* Can use previous as well!
	SELECT MEAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(5d) fill(-1)
	
	SELECT DISTINCT("level description") FROM h2o_feet GROUP BY location

	SELECT MEDIAN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:36:00Z' GROUP BY location

	SELECT SPREAD(water_level) FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-09-18T17:00:00Z' AND time < '2015-09-18T20:30:00Z' GROUP BY time(30m)

	SELECT SUM(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-09-18T17:00:00Z' GROUP BY time(5d)

#### Selectors

	SELECT BOTTOM(water_level,3),location FROM h2o_feet

	SELECT BOTTOM(water_level,location,2) FROM h2o_feet

	SELECT BOTTOM(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' GROUP BY location

	SELECT TOP(water_level,2) FROM h2o_feet WHERE time >= '2015-08-18T04:00:00Z' AND time < '2015-08-18T04:24:00Z' GROUP BY location

	SELECT FIRST(water_level) FROM h2o_feet GROUP BY location

	SELECT LAST(water_level) FROM h2o_feet GROUP BY location

	SELECT MAX(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:54:00Z' GROUP BY time(12m), location

	SELECT MIN(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:54:00Z' GROUP BY time(12m), location

	SELECT PERCENTILE(water_level,5) FROM h2o_feet WHERE location = 'coyote_creek'

	SELECT PERCENTILE(water_level, 100) FROM h2o_feet GROUP BY location


###### Derivative

	name: h2o_feet
	--------------
	time			               water_level
	2015-08-18T00:00:00Z	 2.064
	2015-08-18T00:06:00Z	 2.116
	2015-08-18T00:12:00Z	 2.028
	2015-08-18T00:18:00Z	 2.126
	2015-08-18T00:24:00Z	 2.041
	2015-08-18T00:30:00Z	 2.051
	
	Calculate the rate of change per one second
 	
 	SELECT DERIVATIVE(water_level) FROM h2o_feet WHERE location = 'santa_monica' LIMIT 6

 	SELECT DERIVATIVE(water_level,6m) FROM h2o_feet WHERE location = 'santa_monica' LIMIT 6

 	SELECT DERIVATIVE(MAX(water_level)) FROM h2o_feet WHERE location = 'santa_monica' AND time >= '2015-08-18T00:00:00Z' AND time < '2015-08-18T00:36:00Z' GROUP BY time(12m)

 	SELECT STDDEV(water_level) FROM h2o_feet WHERE time >= '2015-08-18T00:00:00Z' and time < '2015-09-18T12:06:00Z' GROUP BY time(1w), location


##### CQ

	CREATE CONTINUOUS QUERY "min_max" ON "NOAA_water_database" 
		RESAMPLE EVERY 15m FOR 60m
			BEGIN 
				SELECT min("water_level"),max("water_level") INTO what_is_time."min_max_data" FROM autogen."h2o_feet" GROUP BY time(30m) 
			END

##### DROP 

	DROP series where 

	DROP MEASUREMENT h2o_feet

	DROP RETENTION POLICY one_day_only ON NOAA_water_database