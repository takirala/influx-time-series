# myapp.rb
require 'sinatra'
require 'json'
require 'twilio-ruby'
require 'pry'

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

get '/net' do
	erb :net
end

get '/netstat' do
	erb :netstat
end

get '/holt' do
	erb :holt
end

get '/alerts' do
   @logFile = File.read("/tmp/alerts.log")
	erb :alerts
   #@logFile.close
end

post '/setparams' do
   @alert = params[:alert]
   @perc = params[:perc]
   if @alert == "mem" 
    cmd = "/tmp/runmem.sh" +" "+@perc
    system(cmd)
   else
    cmd = "/tmp/cpumem.sh" +" "+@perc
    system(cmd)     
   end
   @account_sid = 'AC5001ed2e2cc293b9a74ade0a92851c57'
   @auth_token = 'a1c525ce010ddde299bafb268ba01d8f'

   # set up a client to talk to the Twilio REST API 
   @client = Twilio::REST::Client.new @account_sid, @auth_token

   @client.account.messages.create({
    :messaging_service_sid => 'MG9159a3b4217071edfc2ff0974a9117fc',
    :to => '+13528701980',
    :body => 'Alert thresshold changed' +" "+@alert+" "+@perc 
   })
   redirect '/alerts'
end

post '/sendalerts' do
 
   before do
     request.body.rewind
     @requeste = JSON.parse request.body.read
   end
   @account_sid = 'AC5001ed2e2cc293b9a74ade0a92851c57' 
   @auth_token = 'a1c525ce010ddde299bafb268ba01d8f' 
 
   # set up a client to talk to the Twilio REST API 
   @client = Twilio::REST::Client.new @account_sid, @auth_token 
 
   @client.account.messages.create({
    :messaging_service_sid => 'MG9159a3b4217071edfc2ff0974a9117fc', 
    :to => '+13528701980', 
    :body => 'Setting Threshold'
   })
end
