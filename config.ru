require "rubygems"
require "bundler"

Bundler.require

require "haml"

get "/" do
  haml :index
end

run Sinatra::Application