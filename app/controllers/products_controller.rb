class ProductsController < ApplicationController

  def index
    @products = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @products = @products.group_by(&:product_category)
  end

  def show
    @product = Shoppe::Product.find_by_permalink(params[:permalink])
  end

  def buy
	  @product = Shoppe::Product.find_by_permalink!(params[:permalink])
    if @product.stock_control = 'false'
      redirect_to product_path(@product.permalink), :notice => "Sorry we are out of stock!"
    else  
  	  current_order.order_items.add_item(@product, 1)
  	  redirect_to product_path(@product.permalink), :notice => "Product has been added successfuly!"
    end
	end

end
