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
    "Bob" => "background Bob",
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
    "Gangster" => "background Gangster",
    "GroovyHoops" => "background Groovy Hoops",
    "HeartTies" => "background Heart Ties",
    "Indigo" => "rgb(113, 94, 126)",
    "Indigo/Charcoal" => "rgb()",
    "Khaki" => "rgb(233, 204, 165)",
    "Lagoon" => "rgb(113, 154, 161)",
    "Lagoon/Lagoon" => "rgb()",
    "LimeGreen" => "rgb(156, 202, 0)",
    "Lilac" => "rgb(123, 80, 166)",
    "Navy" => "rgb(26, 47, 96)",
    "NavyBlue" => "rgb(26, 47, 96)",
    "NavyBlue/SkyBlue" => "rgb()",
    "Orange" => "rgb(255,69,0)",
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
    @products      = Shoppe::Product.root.ordered.includes(:product_category, :variants)
    @products      = @products.group_by(&:product_category)
    @m1            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20)
    @m2            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21)
    @mprods        = @m1 + @m2
  end

  def show
    @product  = Shoppe::Product.find_by_permalink(params[:permalink])
    @p1 = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...21))
    @p2 = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...21))
    @products = @p1 + @p2
    @relatedproducts = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: @product.product_category_id)
    @stylecharts = Stylechart.all

    @sameprods = Shoppe::Product.where("name like ?", "#{@product.name}%")
    @allowedsizes = ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58", "60", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "1SIZE", "2Y", "4Y", "6Y", "8Y"]
    @sizes = []
    @sameprods.each do |a| 
      if @allowedsizes.include?(a.name.split("-").last) 
        @sizes << a.name.split("-").last 
      end 
    end

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
      if @product.stock_control
        current_order.order_items.add_item(@product, 1)
        redirect_to product_path(params[:permalink]), 
        :notice => "Product has been added successfuly!"
      else
        redirect_to product_path(@product.permalink), 
        :alert => "Sorry we are out of stock!"
      end
  end

  # nurse wear

  def nurse_tops
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1).page(params[:page]).per(6) 
  end

  def nurse_sets
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2).page(params[:page]).per(6) 
  end

  def nurse_pants
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3).page(params[:page]).per(6) 
  end

  def nurse_coats
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4).page(params[:page]).per(6) 
  end

  def nurse_caps
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5).page(params[:page]).per(6) 
  end

  def accessories
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6).page(params[:page]).per(6) 
  end

  #steth


  def stethoscopes
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7).page(params[:page]).per(6) 
  end


  #chefwear

  def chef_coats
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8).page(params[:page]).per(6) 
  end

  def chef_hats
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9).page(params[:page]).per(6) 
  end

  def chef_pants
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10).page(params[:page]).per(6) 
  end

  def chef_tops
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11).page(params[:page]).per(6) 
  end

  def aprons
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12).page(params[:page]).per(6) 
  end

  def waitress_vests
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13).page(params[:page]).per(6) 
  end


  #work wear

  def work_fire_retardent
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14).page(params[:page]).per(6) 
  end

  def work_shop_coat
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15).page(params[:page]).per(6) 
  end

  def work_coverall_overall
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16).page(params[:page]).per(6) 
  end

  def work_pants
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17).page(params[:page]).per(6) 
  end

  def work_shirts
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18).page(params[:page]).per(6) 
  end

  def work_vests
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19).page(params[:page]).per(6) 
  end

  #mentality

  def mentality_hyflex
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20).page(params[:page]).per(6) 
  end

  def mentality_stretchflex
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21).page(params[:page]).per(6) 
  end
  #clearance

  def clearance
    @products = Shoppe::Product.where(product_category_id: 22).page(params[:page]).per(6)
  end

end
