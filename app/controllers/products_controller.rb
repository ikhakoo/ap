class ProductsController < ApplicationController

  COLORS = {
    "2toneAqua/Black" => "rgb()",
    "2toneBurgundy/Navy" => "rgb()",
    "2toneCharcoal/Black" => "rgb()",
    "2toneEggplant/Black" => "rgb()",
    "2toneIndigo/Black" => "rgb()",
    "2toneKhaki/Black" => "rgb()",
    "2toneNavyBlue/Black" => "rgb()",
    "2tonePostmanBlue/Black" => "rgb()",
    "2tonePostmanBlue/Navy" => "rgb()",
    "2toneRaspberry/Black" => "rgb()",
    "2toneWhite" => "rgb()",
    "Aqua" => "rgb(33, 171, 232)",
    "Aqua/Black" => "rgb()",
    "Aubergine" => "rgb(104, 87, 105)",
    "Black" => "rgb(0, 0, 0)",
    "Black/Aqua" => "rgb()",
    "Black/White" => "rgb()",
    "BlueCheerios" => "background Blue Cheerios",
    "BlueCheerios/Navy Blue" => "rgb()",
    "Brown" => "rgb(100, 84, 58)",
    "Burgundy" => "rgb(130, 34, 80)",
    "Cappuccino" => "rgb(60, 27, 18)",
    "Caribbean" => "rgb(19, 96, 125)",
    "Ceil" => "rgb(126, 159, 218)",
    "Charcoal" => "rgb(85, 90, 94)",
    "Charcoal/Lilac" => "rgb()",
    "Charcoal/Postman Blue" => "rgb()",
    "Charcoal/PostmanBlue" => "rgb()",
    "DeepOrchid" => "rgb(145, 32, 96)",
    "DeepOrchid/Black" => "rgb()",
    "DeepOrchid/White" => "rgb()",
    "DeepOrchird/Black" => "rgb()",
    "DejaVu" => "background Deja Vu",
    "DizzyVines" => "background Dizzy Vines",
    "DustyRose" => "rgb(233, 110, 153)",
    "Eggplant" => "rgb(81, 45, 141)",
    "Eggplant/Black" => "rgb()",
    "Fireworks" => "background Fireworks",
    "Fireworks/Sea Green" => "rgb()",
    "FloresentButterfly" => "background Floresent Butterfly",
    "FloresentButterfly/Charcoal" => "rgb()",
    "FlowerPower" => "background Flower Power",
    "FlowerPower/RoyalBlue" => "rgb()",
    "GroovyHoops" => "background Groovy Hoops",
    "HeartTies" => "background Heart Ties",
    "Indigo" => "rgb(113, 94, 126)",
    "Indigo/Charcoal" => "rgb()",
    "Khaki" => "rgb(233, 204, 165)",
    "Lagoon" => "rgb(113, 154, 161)",
    "Lagoon/Lagoon" => "rgb()",
    "Lime Green" => "rgb(156, 202, 0)",
    "Lilac" => "rgb(123, 80, 166)",
    "Navy" => "rgb(26, 47, 96)",
    "NavyBlue" => "rgb(26, 47, 96)",
    "NavyBlue/SkyBlue" => "rgb()",
    "OliveGreen" => "rgb(147, 155, 109)",
    "PaisleyPink" => "background Paisley Pink",
    "Papillon" => "background Papillon",
    "PinkSorbet" => "rgb(248, 170 ,221)",
    "PinnedHeart" => "background Pinned Heart",
    "PostmanBlue" => "rgb(110, 129, 162)",
    "PostmanBlue/Navy" => "rgb()",
    "PrettyInPetals" => "background Pretty in Petals",
    "PrettyInPetals/Charcoal" => "rgb()",
    "Raspberry" => "rgb(182, 34, 98)",
    "Red" => "rgb(221, 35, 32)",
    "RoyalBlue" => "rgb(6, 84, 170)",
    "SeaGreen" => "rgb(78, 187, 178)",
    "SeaGreen/Navy" => "rgb()",
    "SkyBlue" => "rgb(125, 176, 229)",
    "SkyBlue/Navy" => "rgb()",
    "SoftMint" => "rgb(191, 204, 186)",
    "SpringBlooming" => "background Spring Blooming",
    "SpringBlooming/Black" => "rgb()",
    "Spruce" => "rgb(45, 94, 64)",
    "StringAlong" => "background String Along",
    "StringAlong/Eggplant" => "rgb()",
    "Teal" => "rgb(16, 136, 149)",
    "Techno" => "background Techno",
    "Techno/Aqua" => "rgb()",
    "White" => "rgb(255, 255, 255)",
    "White/White" => "rgb()",
    "ZenStem" => "background Zen Stem"
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

    @sameprods = Shoppe::Product.where("name like ?", "#{@product.name}%")
    @sizes = []
    @sameprods.each do |a| @sizes << a.name.split("-").last end

    @attributes = @product.product_attributes.public.to_a

    @color_products = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @color_products = @color_products.group_by(&:product_category)

    @colorprods = Shoppe::Product.where("name like ?", "#{@product.name.split("-").first}%")

    @colors_array = []
    @colorprods.each do |a| @colors_array << a.name.split("-").second end  

    @background_details = []

    @split_colors = []
    @colors_array.each do |color| @split_colors << color.split('/') end
    @split_colors = @split_colors.uniq

        @split_colors.each do |combination|
        temp_array = []
        combination.each do |color| 
          temp_array << COLORS[color]
        end

        @background_details << temp_array
    end 

    # binding.pry

    
  end

  def buy
    @product = Shoppe::Product.find_by_permalink(params[:permalink])
    @permalink = params[:permalink]
    @permalink = @permalink.split("-")
    @permalink = @permalink.first @permalink.size - 1
    @permalink = @permalink.join("-")
    @permalink = @permalink + "-" + params[:color] + "-" + params[:size].downcase
    @permalink = @permalink.downcase
    @product = Shoppe::Product.all
    @product = @product.find_by!(permalink: @permalink)

    current_order.order_items.add_item(@product, 1)
    redirect_to product_path(params[:permalink]), 
    :notice => "Product has been added successfuly!"
  end

  # def buy
  #   @product = Shoppe::Product.find(params[:product].to_i)
  #   if params[:variant]
  #     order_product = @product.variants.find(params[:variant].to_i)
  #     current_order.order_items.add_item(order_product, 1)
  #     redirect_to product_path(@product.permalink), 
  #     :notice => "Product has been added successfuly!"
  #   else
  #     order_product = @product
  #       if @product.stock_control
  #         current_order.order_items.add_item(order_product, 1)
  #         redirect_to product_path(@product.permalink), 
  #         :notice => "Product has been added successfuly!"
  #       else
  #         redirect_to product_path(@product.permalink), 
  #         :alert => "Sorry we are out of stock!"
  #       end
  #   end
  # end

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
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1).page(params[:page]).per(8) 
  end

  def nurse_sets
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2).page(params[:page]).per(8) 
  end

  def stethoscopes
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3).page(params[:page]).per(8) 
  end

  def chef
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4).page(params[:page]).per(8) 
  end

  def work
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5).page(params[:page]).per(8) 
  end

  def clearance
    @products = Shoppe::Product.where(product_category_id: 6).page(params[:page]).per(8)
  end

end
