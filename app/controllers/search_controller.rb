class SearchController < ApplicationController

	def index
		@products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*")
		@products = @products.where("LOWER(name) LIKE LOWER(?)", "%#{params[:search]}%").page(params[:page]).per(8)
	end

end
