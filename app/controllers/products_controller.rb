class ProductsController < ApplicationController
  SIZES = [ 'Small', 'Medium', 'Large', 'XL', 'XXL']

  COLORS = {
    "2 tone Aqua/Black" => "rgb()",
    "2 tone Burgundy/Navy" => "rgb()",
    "2 tone Charcoal/Black" => "rgb()",
    "2 tone Eggplant/Black" => "rgb()",
    "2 tone Indigo/Black" => "rgb()",
    "2 tone Khaki/Black" => "rgb()",
    "2 tone Navy Blue/Black" => "rgb()",
    "2 tone Postman Blue/Black" => "rgb()",
    "2 tone Postman Blue/Navy" => "rgb()",
    "2 tone Raspberry/Black" => "rgb()",
    "2 tone White/White" => "rgb()",
    "2tone White/White" => "rgb()",
    "Aqua" => "rgb(33, 171, 232)",
    "Aqua/Black" => "rgb()",
    "Aubergine" => "rgb(104, 87, 105)",
    "Black" => "rgb(0, 0, 0)",
    "Black/Aqua" => "rgb()",
    "Black/White" => "rgb()",
    "Blue Cheerios" => "background Blue Cheerios",
    "Blue Cheerios/Navy Blue" => "rgb()",
    "Brown" => "rgb(100, 84, 58)",
    "Burgundy" => "rgb(130, 34, 80)",
    "Cappuccino" => "rgb(60, 27, 18)",
    "Caribbean" => "rgb(19, 96, 125)",
    "Ceil" => "rgb(126, 159, 218)",
    "Charcoal" => "rgb(85, 90, 94)",
    "Charcoal/Lilac" => "rgb()",
    "Charcoal/Postman Blue" => "rgb()",
    "Charcoal/PostmanBlue" => "rgb()",
    "Deep Orchid" => "rgb(145, 32, 96)",
    "Deep Orchid/Black" => "rgb()",
    "Deep Orchid/White" => "rgb()",
    "Deep Orchird/Black" => "rgb()",
    "Deja Vu" => "background Deja Vu",
    "Dizzy Vines" => "background Dizzy Vines",
    "Dusty Rose" => "rgb(233, 110, 153)",
    "Eggplant" => "rgb(81, 45, 141)",
    "Eggplant/Black" => "rgb()",
    "Fireworks" => "background Fireworks",
    "Fireworks/Sea Green" => "rgb()",
    "Floresent Butterfly" => "background Floresent Butterfly",
    "Floresent Butterfly/Charcoal" => "rgb()",
    "Flower Power" => "background Flower Power",
    "Flower Power/Royal Blue" => "rgb()",
    "Groovy Hoops" => "background Groovy Hoops",
    "Heart Ties" => "background Heart Ties",
    "Indigo" => "rgb(113, 94, 126)",
    "Indigo/Charcoal" => "rgb()",
    "Khaki" => "rgb(233, 204, 165)",
    "Lagoon" => "rgb(113, 154, 161)",
    "Lagoon/Lagoon" => "rgb()",
    "Lime Green" => "rgb(156, 202, 0)",
    "Lilac" => "rgb(123, 80, 166)",
    "Navy" => "rgb(26, 47, 96)",
    "Navy Blue" => "rgb(26, 47, 96)",
    "Navy Blue/Sky Blue" => "rgb()",
    "Olive Green" => "rgb(147, 155, 109)",
    "Paisley Pink" => "background Paisley Pink",
    "Papillon" => "background Papillon",
    "Pink Sorbet" => "rgb(248, 170 ,221)",
    "Pinned Heart" => "background Pinned Heart",
    "Postman Blue" => "rgb(110, 129, 162)",
    "Postman Blue/Navy" => "rgb()",
    "Pretty in Petals" => "background Pretty in Petals",
    "Pretty in Petals/Charcoal" => "rgb()",
    "Raspberry" => "rgb(182, 34, 98)",
    "Red" => "rgb(221, 35, 32)",
    "Royal Blue" => "rgb(6, 84, 170)",
    "Sea Green" => "rgb(78, 187, 178)",
    "Sea Green/Navy" => "rgb()",
    "Sky Blue" => "rgb(125, 176, 229)",
    "Sky Blue/Navy" => "rgb()",
    "Soft Mint" => "rgb(191, 204, 186)",
    "Spring Blooming" => "background Spring Blooming",
    "Spring Blooming/Black" => "rgb()",
    "Spruce" => "rgb(45, 94, 64)",
    "String Along" => "background String Along",
    "String Along/Eggplant" => "rgb()",
    "Teal" => "rgb(16, 136, 149)",
    "Techno" => "background Techno",
    "Techno/Aqua" => "rgb()",
    "White" => "rgb(255, 255, 255)",
    "White/White" => "rgb()",
    "Zen Stem" => "background Zen Stem"
  }

  def index
    @product_image = Shoppe::Product.find_by_permalink(params[:permalink])
    @products      = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @products      = @products.group_by(&:product_category)
  end

  def show
    @product  = Shoppe::Product.find_by_permalink(params[:permalink])
    @products = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @products = @products.group_by(&:product_category)


    
    @attributes = @product.product_attributes.public.to_a

    @product_colors = @product[:short_description].split("\n")
    @colors_array = []
    @product_colors.each do |a| @colors_array << a.split("/")  end  
    @sizes = SIZES
    @background_details = []
    @colors_array.each do |combination|
        temp_array = []
        combination.each do |color| 
          temp_array << COLORS[color]
        end

        @background_details << temp_array
    end 

    
  end

  def buy
    @product = Shoppe::Product.find_by_permalink!(params[:permalink])
    if @product.stock_control # do we have any stock left?
      current_order.order_items.add_item(@product, 1)
      redirect_to product_path(@product.permalink), :notice => "Product has been added successfuly!"
    else  
      redirect_to product_path(@product.permalink), :alert => "Sorry we are out of stock!"
    end
  end

  def remove
	@product = Shoppe::Product.find_by_permalink!(params[:permalink])
    item = current_order.order_items.find(@product)
  end

  def nurse
    @p1 = Shoppe::Product.where(product_category_id: 1)
    @p2 = Shoppe::Product.where(product_category_id: 2)
    @products = @p1, @p2
  end

  def nurse_tops
    @products = Shoppe::Product.where(product_category_id: 1)
  end

  def nurse_sets
    @products = Shoppe::Product.where(product_category_id: 2)
  end

  def stethoscopes
    @products = Shoppe::Product.where(product_category_id: 4)
  end

  def chef
    @products = Shoppe::Product.where(product_category_id: 5)
  end

  def work
    @products = Shoppe::Product.where(product_category_id: 6)
  end

  def clearance
    @products = Shoppe::Product.where(product_category_id: 7)
  end

end
