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
	cat3 = Shoppe::ProductCategory.create!(:name => 'Stethoscopes')
	cat4 = Shoppe::ProductCategory.create!(:name => 'Chef')
	cat5 = Shoppe::ProductCategory.create!(:name => 'Work')
	cat6 = Shoppe::ProductCategory.create!(:name => 'Clearance')

	file_paths = Dir["db/seeds_data/*.jpeg"]

	tops = {
		"The Rosey.jpeg" => {
			sku: "T3030",
			description: "<p>Simplicity at its best, this classic v-neck top is designed with a double stitched 
			detail line across the chest and two tailored lines down the back. Two lower patch pockets,
			the right side is enclosed with inner sectional pockets.The top is finished off with two small side 
			slits and a convenient shoulder pen pocket.</p><p>Stretch-Flex Blend: 65% Poly/32% Rayon/3% Spandex</p>",
			colors: ["Black", "Royal Blue", "Charcoal", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"The Pearl.jpeg" => {
			sku: "T3020",
			description: "<p>Tailored for fit, this v-neck top features two flex side panels, one shoulder pen 
			pocket and two lower patch pockets. One of the patch pockets includes detailed stitching on the 
			outside with a utility D-ring and an inner smart phone pocket.</p><p>*Stretch-Flex Blend: 
			65% Poly/32% Rayon/3% Spandex</p>",
		  colors: ["Black", "Royal Blue", "Charcoal", "White"],
		  sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Basic V Neck Scrub Top.jpeg" => {
			sku: "606T",
			description: "<p>The newest addition to the MOBB line, this unisex scrub top is all about classic 
			simplicity. Featuring a standard v-neck with one chest pocket and one shoulder pen pocket. This top 
			mates perfectly with 608P and is a favorite among school programs.</p>",
			colors: ["Black", "Cappuccino", "Ceil", 
								"Lagoon", "Postman Blue", "Sky Blue", 
								"Burgundy", "Caribbean", "Charcoal", 
								"Navy Blue", "Royal Blue", "White"
							],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Zipper Front Ladies Work Top.jpeg" => {
			sku: "202T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Flexi V Neck Scrub Top.jpeg" => {
			sku: "324T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			colors: ["2tone White/White", "Black", "Brown", "Charcoal", "Deja Vu", "Eggplant", "Heart Ties", "Khaki",
							 "Lime Green", "Olive Green", "Papillon", "Postman Blue", "Raspberry", "Royal Blue", "String Along",
							 "Zen Stem", "Aqua", "Blue Cheerios", "Cappuccino", "Deep Orchid", "Dusty Rose", "Fire Works", "Indigo",
							 "Lagoon", "Navy Blue", "Paisley Pink", "Pink Sorbet", "Pretty in Petals", "Red", "Sea Green",
							 "Techno"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Ultra Flexi Scrub Top.jpeg" => {
			sku: "524T",
			description: "<p>The Ultra Flexi scrub top has multiple black stretch panels for the most superb fit 
			and ultimate movement.The Ultra Flexi v-neck top also has two lower pockets and one shoulder pen pocket.</p>",
			colors: ["Aqua", "Charcoal", "Navy Blue", "Black", "Deep Orchid", "Sky Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"3 Pocket V Neck Scrub Top.jpeg" => {
			sku: "308T",
			description: "<p>A bold, basic 3 pocket v-neck scrub top featuring dolman sleeves. This scrub top is also available as a set</p>",
			colors: ["Aqua", "Burgundy", "Ceil", "Eggplant", "Lagoon", "Postman Blue", 
								"Royal Blue", "Spruce", "Black", "Caribbean", "Charcoal", "Khaki", 
								"Navy Blue", "Rasberry", "Sky Blue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL"]
		},
		"Unisex V Neck Scrub Top.jpeg" => {
			sku: "310T",
			description: "<p>A classic v-neck scrub top popular among men and women. This top has a slightly longer hem 
			line making it an excellent choice for anyone with a taller stature. This top has three front pockets, one shoulder 
			pen pocket and is available in every MOBB color</p>",
			colors: ["Aqua", "Burgundy", "Caribbean", "Charcoal", "Khaki", "Navy Blue", "Postman Blue", "Royal Blue", 
								"Sky Blue", "Teal", "Black", "Cappuccino", "Ceil", "Eggplant", "Lagoon", "Olive Green", "Red",
								"Sea Green", "Spruce", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
		},
		"Ladies Sculpted Scrub Top.jpeg" => {
			sku: "410T",
			description: "<p>A simple twist on our classic neckline. This scrub top features a beautifully sculpted wave neckline 
			with contrasting color. The top also has two lower pockets, one chest pocket and one shoulder pen pocket.</p>",
			colors: ["Aqua/Black", "Charcoal/Postman Blue", "Eggplant/Black", "White/White", 
								"Black/White", "Deep Orchid/White", "Navy Blue/Sky Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Active Flexi V Neck Scrub Top.jpeg" => {
			sku: "424T",
			description: "<p>Comfortable and stylish this scrub top feels and looks amazing. The stretch panels create a fantastic fit 
			and allow for great movement. The flexi v-neck has two lower pockets and one shoulder pen pocket</p>",
			colors: ["Indigo/Black", "Eggplant/Black", "Rasberry/Black", "Aqua/Black", "Charcoal/Black", "Navy Blue/Black",
								"White/White", "Postman Blue/Black"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Mens Two Tone Scrub Top.jpeg" => {
			sku: "409T",
			description: "<p>Available in four color-ways this scrub top is becoming a favorite among men in the medical field. 
			This two-tone scrub top has one chest pocket and one shoulder pen pocket. Also available as a set with the 409P</p>",
			colors: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "Postman Blue/Navy"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Empire Tie Back Scrub Top.jpeg" => {
			sku: "420T",
			description: "<p>This ultra feminine scrub top features an empire waist and ties at the back. Keeping with tradition this top has a v-neck collar and two front pockets</p>",
			colors: ["Navy", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Coco.jpeg" => {
			sku: "T1018",
			description: "<p>A stunning v-neck top with an hourglass silhouette. Featuring flex sleeves and side panels with a gathered cap sleeve detail, 
			two hidden pockets and custom tailoring for an exceptional fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex<p>",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Mandy.jpeg" => {
			sku: "T1010",
			description: "<p>A unique style and ultra chic fit, this deep cut mandarin neckline features two lower pockets, flex side panels and has 
			beautiful tailoring through the back for a custom fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"The Roxy.jpeg" => {
			sku: "T1016",
			description: "<p>A fit for fashion and function, this top features flex sleeves and side panels, a gathered cap sleeve detail, 
			chest darts and two hidden pockets.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: ["Aubergine", "White", "Soft Mint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Ladies Zipper Detail Scrub Top.jpeg" => {
			sku: "530T",
			description: "<p>Fun, funky and fitted. This sporty scrub top features reflective trim, asymmetrical zipper detail, two lower pockets, one chest pocket and one shoulder pen pocket</p>",
			colors: ["Navy Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"V Neck Print Scrub Top.jpeg" => {
			sku: "320T",
			description: "<p>This classic printed v-neck scrub top is great for those who need to carry as many accessories as possible. A total of 5 front pockets offer a home for everything you need to carry throughout the day</p>",
			colors: ["Blue Cheerios", "Fire Works", "Flower Power", "Heart Ties", "Pinned Heart", "Spring Blooming", 
								"Techno", "Dizzy Vines", "Florescent Butterfly", "Groovy Hoops", "Papillon", "Pretty in Petals",
								"String Along"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Criss Cross Scrub Top.jpeg" => {
			sku: "323T",
			description: "<p>Available in a large variety of prints and solid colors this scrub top will always be a top seller. Features a v-neck with a contrast color trim as well as two lower pockets and one shoulder pen pocket. This scrub top is also available as a set</p>",
			colors: ["Aqua/Black", "Blue Cheerios/Navy Blue", "Charcoal/Postman Blue", "Eggplant/Black", "Floresent Butterfly/Charcoal",
								"Lagoon/Lagoon", "Postman Blue/Navy", "Sea Green/Navy", "Spring Blooming/Black" , "Techno/Aqua", 
								"Black/Aqua", "Charcoal/Lilac", "Deep Orchid/Black", "Fireworks/Sea Green", "Flower Power/Royal Blue", 
								"Indigo/Charcoal", "Navy Blue/Sky Blue", "Pretty in Petals/Charcoal", "Sky Blue/Navy", 
								"String Along/Eggplant", "White/White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"Button Front Ladies Work Top.jpeg" => {
			sku: "201T",
			description: "<p>Button up in this ladies work top featuring 3 patch pockets, button front closure and a collar</p>",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["S", "M", "L", "XL", "2XL"]
		},
		"Ladies Long Sleeve Tee.jpeg" => {
			sku: "LT101",
			description: "<p>100% cotton, 100% comfort. This ladies long sleeve tee is made with pre-shrunk cotton and is perfect worn on it's own or layered under a scrub top. The top stitched collar gives it the strength and durability MOBB is known for</p>",
			colors: ["Black", "White", "Navy Blue"],
			sizes: ["S", "M", "L", "XL", "2XL"]
		}
	}

	sets = {
		"Unisex 8 Pocket Drawstring/Elastic Scrub Set.jpeg" => {
			sku: "310/307",
			description: "<p>Amazing fit in every MOBB color imaginable. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>
<p><strong>Size 5XL only available in Colors: Black, Charcoal, Burgundy, Caribbean, Lagoon, Navy, Postman Blue, Royal Blue</p></strong>
<p><strong>Size 6XL only available in Navy</p></strong>",
			colors: ["Aqua","Burgundy","Caribbean","Charcoal","Khaki","Lime Green","Olive Green","Royal Blue","Spruce",
								"White","Black","Cappuccino","Ceil","Eggplant","Lagoon","Navy Blue","Postman Blue","Sky Blue","Teal"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Unisex 5 Pocket Drawstring Scrub Set.jpeg" => {
			sku: "606/608",
			description: "<p>MOBB's newest style, this scrub set replaces the 306/306. A classic v-neck scrub top with one chest pocket and one shoulder pen pocket and a simple five pocket drawstring pant. This set is ideal for school programs.</p>",
			colors: ["Black","Cappuccino","Ceil","Lagoon","Postman Blue","Sky Blue","Burgundy","Caribbean","Charcoal",
								"Navy Blue","Royal Blue","White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
		},
		"Reversible O.R. Drawstring Scrub Set.jpeg" => {
			sku: "306TA/306PA",
			description: "<p>Available for special programs, this scrub set was designed to meet the needs of hospital O.R. staff. A unisex, reversible, drawstring scrub set featuring a color code size indicator on the chest pocket and a simple drawstring scrub pant with one back pocket.</p>",
			colors: ["Lagoon"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Mens Two Tone Scrub Set with 6 Pocket Scrub Pants.jpeg" => {
			sku: "409/409",
			description: "<p>Becoming one of MOBB's best sellers. This Men's two tone v-neck has one chest pocket and one shoulder pen pocket and is available in four color-ways. The six pocket cargo scrub pant has a built in belt buckle and is available in black and navy.</p>",
			colors: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "Postman Blue/Navy"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Childrens Scrub Set.jpeg" => {
			sku: "CH400",
			description: "<p>Mobb's High Quality Children's Scrub Set</p>",
			colors: ["Lagoon"],
			sizes: ["2Y","4Y","6Y","8Y"]
		},
		"Criss Cross Flip Flap.jpeg" => {
			sku: "323/312",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Aqua/Black", "Charcoal/PostmanBlue", "Eggplant/Black", "Lagoon/Lagoon", "Postman Blue/Navy",
								"Sky Blue/Navy", "Black/Aqua", "Deep Orchird/Black", "Indigo/Charcoal", "Navy Blue/Sky Blue",
								"Sea Green/Navy", "White/White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"]
		},
		"3 Pocket V Neck Scrub Top with Flip Flap Scrub Pants.jpeg" => {
			sku: "308/312",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Aqua", "Burgundy", "Ceil", "Eggplant", "Lagoon", "Postman Blue", "Royal Blue", "Spruce", "Black", 
								"Caribbean", "Charcoal", "Khaki", "Navy Blue", "Raspberry", "Sky Blue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL"]
		}
	}

	# clearance = {
		
	# }

	default_params = { 
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

		if params = tops[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-#{color}"))
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

		elsif params = sets[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-#{color}"))
				pro.product_category = cat2
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

		# elsif params = clearance[filename] 

		# 		params[:colors].each do |color|

		# 		# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
		# 		pro = Shoppe::Product.new(default_params.merge(sku: params[:sku], name: "#{name}-#{color}"))
		# 		pro.product_category = cat3
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
		end
  end
end

seed_shit