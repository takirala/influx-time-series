require 'rubygems'
require 'json'

File.open("/tmp/alerts.log", "r") do |f|
  f.each_line do |line|
    jsonString = JSON.parse(line)
    puts jsonString['message']
    sjson = jsonString['data']
    puts sjson['series']
  end
end
