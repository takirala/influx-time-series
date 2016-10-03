## Influx QL



#### Set up data and database

Open webinterface at

	http://localhost:8083


Download dummy data
    
    curl https://s3-us-west-1.amazonaws.com/noaa.water.database.0.9/NOAA_data.txt > NOAA_data.txt


Write dummy data to the database.

	influx -import -path=NOAA_data.txt -precision=s


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
