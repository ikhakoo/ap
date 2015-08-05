class SearchController < ApplicationController

	def index
		@products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where("LOWER(name) LIKE LOWER(?)", "%#{params[:search]}%").page(params[:page]).per(6)
	end

end
