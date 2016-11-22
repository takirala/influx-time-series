# myapp.rb
require 'sinatra'
require 'json'
get '/' do
	erb :index
end

get '/cpu_idle' do
	erb :cpu_idle
end

get '/mem' do
	erb :mem
end

get '/disk' do
	erb :diskio
end

get '/proc' do
	erb :proc
end

get '/holt' do
	erb :holt
end

get '/alerts' do
   @logFile = File.read("/tmp/alerts.log")
	erb :alerts
   #@logFile.close
end
