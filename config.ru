require "rubygems"
require "bundler"

Bundler.require

require "haml"

get "/" do
  @iframe = params[:widget]
  haml :index
end

run Sinatra::Application