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
<<<<<<< HEAD
    if @product.stock_control = 'true'
      current_order.order_items.add_item(@product, 1)
      redirect_to product_path(@product.permalink), :notice => "Product has been added successfuly!"
=======
    if @product.stock_control == 'false'
      redirect_to product_path(@product.permalink), :notice => "Sorry we are out of stock!"
>>>>>>> 577f519e442fa46232df8cf3d3f89b680f70f7f4
    else  
      redirect_to product_path(@product.permalink), :alert => "Sorry we are out of stock!"
    end
	end

  def nurse
    @products = Shoppe::Product.where(product_category_id: 1).paginate(page: params[:page], :per_page => 15)
  end

  def stethoscopes
    @products = Shoppe::Product.where(product_category_id: 2).paginate(page: params[:page], :per_page => 15)
  end

  def chef
    @products = Shoppe::Product.where(product_category_id: 3).paginate(page: params[:page], :per_page => 15)
  end

  def work
    @products = Shoppe::Product.where(product_category_id: 4).paginate(page: params[:page], :per_page => 15)
  end

  def clearance
    @products = Shoppe::Product.where(product_category_id: 5).paginate(page: params[:page], :per_page => 15)
  end

end
