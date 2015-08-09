class SearchController < ApplicationController

	def index
		@products = Shoppe::Product.all
		@products = @products.where("LOWER(name) LIKE LOWER(?) OR LOWER(sku) LIKE LOWER(?)", "%#{params[:search]}%", "%#{params[:search]}%").page(params[:page]).per(8)
	end

end
