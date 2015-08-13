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
    "Blue" => "rgb(0, 0, 255)",
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
    "Gray" => "rgb(190, 190, 190)",
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
    "PinkSorbet" => "rgb(248, 170, 221)",
    "Pink" => "rgb(255, 192, 203)",
    "PinnedHeart" => "background Pinned Heart",
    "PostmanBlue" => "rgb(110, 129, 162)",
    "PostmanBlue/Navy" => "rgb()",
    "PrettyInPetals" => "background Pretty in Petals",
    "PrettyInPetals/Charcoal" => "rgb()",
    "Purple" => "rgb(160, 32, 240)",
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
    @tops          = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1)
    @sets          = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2)
    @clearance     = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22)
    @m1            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20)
    @m2            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21)
    @mprods        = @m1 + @m2
    @l1            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...19))
    @l2            = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...19))
    @latest        = @l1 + @l2
  end

  def show
    @product  = Shoppe::Product.find_by_permalink(params[:permalink])
    @p1 = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...21))
    @p2 = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: rand(1...21))
    @products = @p1 + @p2
    @relatedproducts = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: @product.product_category_id)

    @allowedsizes = ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52", "54", "56", "58", "60", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "1SIZE", "2Y", "4Y", "6Y", "8Y", "150mm", "190mm"]
    @product_sizes = @product.sizes
    @colorprods = @product.colors

    @colors_array = []
    @colorprods.split(",").each do |a| @colors_array << a end  

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

    if @product.product_category_id == 22

      @all_sizes = []
      @all_sizes = @product_sizes.split("-").first

      @clearance_sizes = @product_sizes.split("-")
      @clearance_sizes = @clearance_sizes.drop(1)

      @clearance_hash = @colors_array.zip(@clearance_sizes).to_h


      @sizes = []
      @all_sizes.split(",").each do |a| 
        if @allowedsizes.include?(a) 
          @sizes << a
        end 
      end
      @sizes.join(",")

    else

      @sizes = []
      @product_sizes.split(",").each do |a| 
        if @allowedsizes.include?(a) 
          @sizes << a
        end 
      end
    end
  end

  def buy
    @product = Shoppe::Product.find_by_permalink(params[:permalink])
      if @product.stock_control
        @color = params[:color]
        @size = params[:size]
        current_order.order_items.add_item(@product, 1, @color, @size)
        redirect_to product_path(params[:permalink]), 
        :notice => "Product has been added successfuly!"
      else
        redirect_to product_path(@product.permalink), 
        :alert => "Sorry we are out of stock!"
    end
  end

  # nurse wear

  def nurse_tops
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 1).page(params[:page]).per(@per_page)
      end
    end
  end

  def nurse_sets
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 2).page(params[:page]).per(@per_page)
      end
    end 
  end

  def nurse_pants
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 3).page(params[:page]).per(@per_page)
      end
    end 
  end

  def nurse_coats
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 4).page(params[:page]).per(@per_page)
      end
    end
  end

  def nurse_caps
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 5).page(params[:page]).per(@per_page)
      end
    end 
  end

  def nurse_gowns
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 23).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 23, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 23, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 23, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 23).page(params[:page]).per(@per_page)
      end
    end 
  end

  def accessories
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 6).page(params[:page]).per(@per_page)
      end
    end 
  end

  #steth


  def stethoscopes
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 7).page(params[:page]).per(@per_page)
      end
    end 
  end


  #chefwear

  def chef_coats
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 8).page(params[:page]).per(@per_page)
      end
    end 
  end

  def chef_hats
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 9).page(params[:page]).per(@per_page)
      end
    end
  end

  def chef_pants
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 10).page(params[:page]).per(@per_page)
      end
    end 
  end

  def chef_tops
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 11).page(params[:page]).per(@per_page)
      end
    end
  end

  def aprons
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 12).page(params[:page]).per(@per_page)
      end
    end
  end

  def waitress_vests
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 13).page(params[:page]).per(@per_page)
      end
    end 
  end


  #work wear

  def work_fire_retardent
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 14).page(params[:page]).per(@per_page)
      end
    end 
  end

  def work_shop_coat
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 15).page(params[:page]).per(@per_page)
      end
    end 
  end

  def work_coverall_overall
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 16).page(params[:page]).per(@per_page)
      end
    end 
  end

  def work_pants
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 17).page(params[:page]).per(@per_page)
      end
    end 
  end

  def work_shirts
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 18).page(params[:page]).per(@per_page)
      end
    end 
  end

  def work_vests
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 19).page(params[:page]).per(@per_page)
      end
    end
  end

  #mentality

  def mentality_hyflex
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 20).page(params[:page]).per(@per_page)
      end
    end 
  end

  def mentality_stretchflex
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 21).page(params[:page]).per(@per_page)
      end
    end
  end
  
  #clearance

  def clearance
    @per_page = params[:per_page] || 8
    @sex = params[:sex]
    @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22).page(params[:page]).per(@per_page)
    if params[:sex]
       if @sex == "Men"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22, mens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Women"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22, womens: true).page(params[:page]).per(@per_page)
       elsif @sex == "Unisex"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22, unisex: true).page(params[:page]).per(@per_page)
      elsif @sex == "All"
        @products = Shoppe::Product.select("DISTINCT ON (shoppe_products.sku) shoppe_products.*").where(product_category_id: 22).page(params[:page]).per(@per_page)
      end
    end 
  end

end
