class SearchController < ApplicationController

	def index
		@products = Shoppe::Product.where("LOWER(name) LIKE LOWER(?)", "%#{params[:search]}%").page(params[:page]).per(6) 
	end

end
