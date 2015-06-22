class ProductsController < ApplicationController

  def index
    @product_image = Shoppe::Product.find_by_permalink(params[:permalink])
    @products = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @products = @products.group_by(&:product_category)
  end

  def show
    @product = Shoppe::Product.find_by_permalink(params[:permalink])
  end

  def buy
	  @product = Shoppe::Product.find_by_permalink!(params[:permalink])
    if @product.stock_control = 'true'
      current_order.order_items.add_item(@product, 1)
      redirect_to product_path(@product.permalink), :notice => "Product has been added successfuly!"
    else  
      redirect_to product_path(@product.permalink), :alert => "Sorry we are out of stock!"
    end
	end

  def nurse
    @p1  = Shoppe::Product.where(product_category_id: 1)
    @p2  = Shoppe::Product.where(product_category_id: 2)
    @p3  = Shoppe::Product.where(product_category_id: 3)
    @p4  = Shoppe::Product.where(product_category_id: 4)
    @p5  = Shoppe::Product.where(product_category_id: 5)
    @p6  = Shoppe::Product.where(product_category_id: 6)
    @p7  = Shoppe::Product.where(product_category_id: 7)
    @p8  = Shoppe::Product.where(product_category_id: 8)
    @p9  = Shoppe::Product.where(product_category_id: 9)
    @p10 = Shoppe::Product.where(product_category_id: 10)
    @products = @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10 
  end

  def stethoscopes
    @products = Shoppe::Product.where(product_category_id: 11)
  end

  def chef
    @products = Shoppe::Product.where(product_category_id: 12)
  end

  def work
    @products = Shoppe::Product.where(product_category_id: 13)
  end

  def clearance
    @products = Shoppe::Product.where(product_category_id: 14)
  end

end
