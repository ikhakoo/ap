class SearchController < ApplicationController

	def index
		@products = Shoppe::Product.all
		@per_page = params[:per_page] || 8
		@products = @products.where("LOWER(name) LIKE LOWER(?) OR LOWER(sku) LIKE LOWER(?)", "%#{params[:search]}%", "%#{params[:search]}%").page(params[:page]).per(@per_page)
	end

end
