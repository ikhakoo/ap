# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


# encoding: UTF-8

def get_file(name, content_type = 'image/jpeg')
  file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.open(File.join(Rails.root, 'db', 'seeds_data', name), 'rb'))
  file.original_filename = File.basename(name, File.extname(name))
  file.content_type = content_type
  file
end


def seed_shit

	tax_rate = Shoppe::TaxRate.create!(:name => "HST", :rate => 13.0)

	# delivery services

	ds = Shoppe::DeliveryService.create!(:name => "Next Day Delivery", :code => 'ND16', :courier => 'AnyCourier', :tracking_url => 'http://trackingurl.com/track/{{consignment_number}}')
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 0, :max_weight => 1, :price => 5.0, :cost_price => 4.50, :tax_rate => tax_rate)
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 1, :max_weight => 5, :price => 8.0, :cost_price => 7.5, :tax_rate => tax_rate)
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 5, :max_weight => 20, :price => 10.0, :cost_price => 9.50, :tax_rate => tax_rate)

	ds = Shoppe::DeliveryService.create!(:name => "Saturday Delivery", :code => 'NDSA16', :courier => 'AnyCourier', :tracking_url => 'http://trackingurl.com/track/{{consignment_number}}')
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 0, :max_weight => 1, :price => 27.0, :cost_price => 24.00, :tax_rate => tax_rate)
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 1, :max_weight => 5, :price => 29.0, :cost_price => 20.00, :tax_rate => tax_rate)
	ds.delivery_service_prices.create!(:code => 'Parcel', :min_weight => 5, :max_weight => 20, :price => 37.0, :cost_price => 32.00,:tax_rate => tax_rate)

	# categories
	cat1 = Shoppe::ProductCategory.create!(:name => 'Tops')
	cat2 = Shoppe::ProductCategory.create!(:name => 'Sets')


	file_paths = Dir["db/seeds_data/*.jpeg"]

	images = {
		"The Rosey.jpeg" => {
			sku: "T3030",
			colors: ["Black", "Royal Blue", "Charcoal", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"The Pearl.jpeg" => {
			sku: "T3020",
		  colors: ["Black", "Royal Blue", "Charcoal", "White"],
		  sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Basic V Neck Scrub Top.jpeg" => {
			sku: "606T",
			colors: ["Black", "Cappuccino", "Ceil", 
								"Lagoon", "Postman Blue", "Sky Blue", 
								"Burgundy", "Caribbean", "Charcoal", 
								"Navy Blue", "Royal Blue", "White"
							],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Zipper Front Ladies Work Top.jpeg" => {
			sku: "202T",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Flexi V Neck Scrub Top.jpeg" => {
			sku: "324T",
			colors: ["2tone White/White", "Black", "Brown", "Charcoal", "Deja Vu", "Eggplant", "Heart Ties", "Khaki",
							 "Lime Green", "Olive Green", "Papillon", "Postman Blue", "Raspberry", "Royal Blue", "String Along",
							 "Zen Stem", "Aqua", "Blue Cheerios", "Cappuccino", "Deep Orchid", "Dusty Rose", "Fire Works", "Indigo",
							 "Lagoon", "Navy Blue", "Paisley Pink", "Pink Sorbet", "Pretty in Petals", "Red", "Sea Green",
							 "Techno"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Ultra Flexi Scrub Top.jpeg" => {
			sku: "524T",
			colors: ["Aqua", "Charcoal", "Navy Blue", "Black", "Deep Orchid", "Sky Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"3 Pocket V Neck Scrub Top.jpeg" => {
			sku: "308T",
			colors: ["Aqua", "Burgundy", "Ceil", "Eggplant", "Lagoon", "Postman Blue", 
								"Royal Blue", "Spruce", "Black", "Caribbean", "Charcoal", "Khaki", 
								"Navy Blue", "Rasberry", "Sky Blue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL"]
		},
		"Unisex V Neck Scrub Top.jpeg" => {
			sku: "310T",
			colors: ["Aqua", "Burgundy", "Caribbean", "Charcoal", "Khaki", "Navy Blue", "Postman Blue", "Royal Blue", 
								"Sky Blue", "Teal", "Black", "Cappuccino", "Ceil", "Eggplant", "Lagoon", "Olive Green", "Red",
								"Sea Green", "Spruce", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
		},
		"Ladies Sculpted Scrub Top.jpeg" => {
			sku: "410T",
			colors: ["Aqua/Black", "Charcoal/Postman Blue", "Eggplant/Black", "White/White", 
								"Black/White", "Deep Orchid/White", "Navy Blue/Sky Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Active Flexi V Neck Scrub Top.jpeg" => {
			sku: "424T",
			colors: ["Indigo/Black", "Eggplant/Black", "Rasberry/Black", "Aqua/Black", "Charcoal/Black", "Navy Blue/Black",
								"White/White", "Postman Blue/Black"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Men's Two Tone Scrub Top.jpeg" => {
			sku: "409T",
			colors: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "Postman Blue/Navy"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Empire Tie Back Scrub Top.jpeg" => {
			sku: "420T",
			colors: ["Navy", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Coco.jpeg" => {
			sku: "T1018",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Mandy.jpeg" => {
			sku: "T1010",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Roxy.jpeg" => {
			sku: "T1016",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Ladies Zipper Detail Scrub Top.jpeg" => {
			sku: "530T",
			colors: ["Navy Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"V Neck Print Scrub Top.jpeg" => {
			sku: "320T",
			colors: ["Blue Cheerios", "Fire Works", "Flower Power", "Heart Ties", "Pinned Heart", "Spring Blooming", 
								"Techno", "Dizzy Vines", "Florescent Butterfly", "Groovy Hoops", "Papillon", "Pretty in Petals",
								"String Along"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Criss Cross Scrub Top.jpeg" => {
			sku: "323T",
			colors: ["Aqua/Black", "Blue Cheerios/Navy Blue", "Charcoal/Postman Blue", "Eggplant/Black", "Floresent Butterfly/Charcoal",
								"Lagoon/Lagoon", "Postman Blue/Navy", "Sea Green/Navy", "Spring Blooming/Black" , "Techno/Aqua", 
								"Black/Aqua", "Charcoal/Lilac", "Deep Orchid/Black", "Fireworks/Sea Green", "Flower Power/Royal Blue", 
								"Indigo/Charcoal", "Navy Blue/Sky Blue", "Pretty in Petals/Charcoal", "Sky Blue/Navy", 
								"String Along/Eggplant", "White/White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Button Front Ladies Work Top.jpeg" => {
			sku: "201T",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["S", "M", "L", "XL", "2XL"]
		},
		"Ladies Long Sleeve Tee.jpeg" => {
			sku: "LT101",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["S", "M", "L", "XL", "2XL"]
		},
		"Men's Two Tone Scrub Set with 6 Pocket Scrub Pants.jpeg" => {
			sku: "409/409",
			color: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "Postman Blue/Navy"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Criss Cross Flip Flap.jpeg" => {
			sku: "323/312",
			colors: ["Aqua/Black", "Charcoal/PostmanBlue", "Eggplant/Black", "Lagoon/Lagoon", "Postman Blue/Navy",
								"Sky Blue/Navy", "Black/Aqua", "Deep Orchird/Black", "Indigo/Charcoal", "Navy Blue/Sky Blue",
								"Sea Green/Navy", "White/White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"3 Pocket V Neck Scrub Top with Flip Flap Scrub Pants.jpeg" => {
			sku: "308/312",
			colors: ["Aqua", "Burgundy", "Ceil", "Eggplant", "Lagoon", "Postman Blue", "Royal Blue", "Spruce", "Black", 
								"Caribbean", "Charcoal", "Khaki", "Navy Blue", "Raspberry", "Sky Blue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL"]
		}
	}

	images2 = {
		"Unisex 8 Pocket Drawstring/Elastic Scrub Set.jpeg" => {
			sku: "310/307",
			colors: ["Aqua","Burgundy","Caribbean","Charcoal","Khaki","Lime Green","Olive Green","Royal Blue","Spruce",
								"White","Black","Cappuccino","Ceil","Eggplant","Lagoon","Navy Blue","Postman Blue","Sky Blue","Teal"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Unisex 5 Pocket Drawstring Scrub Set.jpeg" => {
			sku: "606/608",
			colors: ["Black","Cappuccino","Ceil","Lagoon","Postman Blue","Sky Blue","Burgundy","Caribbean","Charcoal",
								"Navy Blue","Royal Blue","White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
		},
		"Reversible O.R. Drawstring Scrub Set.jpeg" => {
			sku: "306TA/306PA",
			color: ["Lagoon"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Childrens Scrub Set.jpeg" => {
			sku: "CH400",
			color: ["Lagoon"],
			sizes: ["2Y","4Y","6Y","8Y"]
		}
	}

	default_params = {
		:description => 'test', 
		:short_description => 'test', 
		:weight => 1.119, 
		:price => 24.99, 
		:cost_price => 8.99, 
		:tax_rate => tax_rate
	}

	file_paths.each do |fp|

		filename = File.basename(fp)
		name = File.basename(filename, File.extname(filename))
		# fp.split("/").last.gsub(".jpeg", "").titleize

		if params = images[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(sku: params[:sku], name: "#{name}-#{color}"))
				pro.product_category = cat1
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

				p pro

				if params[:sizes]

				params[:sizes].each do |size|
					v = pro.variants.create(
						:name => "#{pro.name}-#{size}", 
						:sku => "#{params[:sku]}-#{size}", 
						:price => pro.price, 
						:cost_price => pro.cost_price, 
						:tax_rate => tax_rate, 
						:weight => pro.weight, 
						:default => true
					)
					v.default_image_file = get_file(filename)
					v.save!
					v.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 10)
				end
			end
				print params[:sku] 
			end
		end

		# if params = images2[filename] 

		# 		params[:colors].each do |color|

		# 		# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
		# 		pro = Shoppe::Product.new(default_params.merge(sku: params[:sku], name: "#{name}-#{color}"))
		# 		pro.product_category = cat2
		# 		pro.default_image_file = get_file(filename)
		# 		pro.save!
		# 		pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

		# 		p pro

		# 		if params[:sizes]

		# 		params[:sizes].each do |size|
		# 			v = pro.variants.create(
		# 				:name => "#{pro.name}-#{size}", 
		# 				:sku => "#{params[:sku]}-#{size}", 
		# 				:price => pro.price, 
		# 				:cost_price => pro.cost_price, 
		# 				:tax_rate => tax_rate, 
		# 				:weight => pro.weight, 
		# 				:default => true
		# 			)
		# 			v.default_image_file = get_file(filename)
		# 			v.save!
		# 			v.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 10)
		# 		end
		# 	end
		# 		print params[:sku] 
		# 	end
		# end
  end
end

seed_shit