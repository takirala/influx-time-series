# myapp.rb
require 'sinatra'

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
