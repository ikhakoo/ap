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
	cat3 = Shoppe::ProductCategory.create!(:name => 'Pants')
	cat4 = Shoppe::ProductCategory.create!(:name => 'Coats')
	cat5 = Shoppe::ProductCategory.create!(:name => 'Caps')
	cat6 = Shoppe::ProductCategory.create!(:name => 'Accessories')

	cat7 = Shoppe::ProductCategory.create!(:name => 'Stethoscopes')

	cat8 = Shoppe::ProductCategory.create!(:name => 'Chef Coats')
	cat9 = Shoppe::ProductCategory.create!(:name => 'Chef Hats')
	cat10 = Shoppe::ProductCategory.create!(:name => 'Chef Pants')
	cat11 = Shoppe::ProductCategory.create!(:name => 'Chef Tops')
	cat12 = Shoppe::ProductCategory.create!(:name => 'Chef Aprons')
	cat13 = Shoppe::ProductCategory.create!(:name => 'Waitress Vests')

	cat14 = Shoppe::ProductCategory.create!(:name => 'Work Fire Retardent')
	cat15 = Shoppe::ProductCategory.create!(:name => 'Work Shop Coat')
	cat16 = Shoppe::ProductCategory.create!(:name => 'Work Coverall Overall')
	cat17 = Shoppe::ProductCategory.create!(:name => 'Work Pants')
	cat18 = Shoppe::ProductCategory.create!(:name => 'Work Shirts')
	cat19 = Shoppe::ProductCategory.create!(:name => 'Work Vests')

	cat20 = Shoppe::ProductCategory.create!(:name => 'Mentality Hyflex')
	cat21 = Shoppe::ProductCategory.create!(:name => 'Mentality StretchFlex')

	cat22 = Shoppe::ProductCategory.create!(:name => 'Clearance')

	file_paths = Dir["db/seeds_data/*.jpeg"]

	tops = {
		"Basic V Neck Scrub Top.jpeg" => {
			sku: "606T",
			description: "<p>The newest addition to the MOBB line, this unisex scrub top is all about classic 
			simplicity. Featuring a standard v-neck with one chest pocket and one shoulder pen pocket. This top 
			mates perfectly with 608P and is a favorite among school programs.</p>",
			colors: ["Black", "Cappuccino", "Ceil", 
								"Lagoon", "PostmanBlue", "SkyBlue", 
								"Burgundy", "Caribbean", "Charcoal", 
								"NavyBlue", "RoyalBlue", "White"
							],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			chart: "606T-SC.png"
		},
		"Zipper Front Ladies Work Top.jpeg" => {
			sku: "202T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			colors: ["Black", "White", "NavyBlue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "202T-SC.png"
		},
		"Flexi V Neck Scrub Top.jpeg" => {
			sku: "324T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			colors: ["2toneWhite", "Black", "Brown", "Charcoal", "DejaVu", "Eggplant", "HeartTies", "Khaki",
							 "LimeGreen", "OliveGreen", "Papillon", "PostmanBlue", "Raspberry", "RoyalBlue", "StringAlong",
							 "ZenStem", "Aqua", "BlueCheerios", "Cappuccino", "DeepOrchid", "DustyRose", "FireWorks", "Indigo",
							 "Lagoon", "NavyBlue", "PaisleyPink", "PinkSorbet", "PrettyInPetals", "Red", "SeaGreen",
							 "Techno"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "324T-SC.png"
		},
		"Ultra Flexi Scrub Top.jpeg" => {
			sku: "524T",
			description: "<p>The Ultra Flexi scrub top has multiple black stretch panels for the most superb fit 
			and ultimate movement.The Ultra Flexi v-neck top also has two lower pockets and one shoulder pen pocket.</p>",
			colors: ["Aqua", "Charcoal", "NavyBlue", "Black", "DeepOrchid", "SkyBlue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "524T-SC.png"
		},
		"3 Pocket V Neck Scrub Top.jpeg" => {
			sku: "308T",
			description: "<p>A bold, basic 3 pocket v-neck scrub top featuring dolman sleeves. This scrub top is also available as a set</p>",
			colors: ["Aqua", "Burgundy", "Ceil", "Eggplant", "Lagoon", "PostmanBlue", 
								"RoyalBlue", "Spruce", "Black", "Caribbean", "Charcoal", "Khaki", 
								"NavyBlue", "Rasberry", "SkyBlue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL"],
			chart: "308T-SC.png"
		},
		"Unisex V Neck Scrub Top.jpeg" => {
			sku: "310T",
			description: "<p>A classic v-neck scrub top popular among men and women. This top has a slightly longer hem 
			line making it an excellent choice for anyone with a taller stature. This top has three front pockets, one shoulder 
			pen pocket and is available in every MOBB color</p>",
			colors: ["Aqua", "Burgundy", "Caribbean", "Charcoal", "Khaki", "NavyBlue", "PostmanBlue", "RoyalBlue", 
								"SkyBlue", "Teal", "Black", "Cappuccino", "Ceil", "Eggplant", "Lagoon", "OliveGreen", "Red",
								"SeaGreen", "Spruce", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
			chart: "310T-SC.png"
		},
		"Ladies Sculpted Scrub Top.jpeg" => {
			sku: "410T",
			description: "<p>A simple twist on our classic neckline. This scrub top features a beautifully sculpted wave neckline 
			with contrasting color. The top also has two lower pockets, one chest pocket and one shoulder pen pocket.</p>",
			colors: ["Aqua/Black", "Charcoal/PostmanBlue", "Eggplant/Black", "White/White", 
								"Black/White", "DeepOrchid/White", "NavyBlue/Sky Blue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "410T-SC.png"
		},
		"Active Flexi V Neck Scrub Top.jpeg" => {
			sku: "424T",
			description: "<p>Comfortable and stylish this scrub top feels and looks amazing. The stretch panels create a fantastic fit 
			and allow for great movement. The flexi v-neck has two lower pockets and one shoulder pen pocket</p>",
			colors: ["Indigo/Black", "Eggplant/Black", "Rasberry/Black", "Aqua/Black", "Charcoal/Black", "NavyBlue/Black",
								"White/White", "PostmanBlue/Black"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "424T-sc.png"
		},
		"Mens Two Tone Scrub Top.jpeg" => {
			sku: "409T",
			description: "<p>Available in four color-ways this scrub top is becoming a favorite among men in the medical field. 
			This two-tone scrub top has one chest pocket and one shoulder pen pocket. Also available as a set with the 409P</p>",
			colors: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "PostmanBlue/Navy"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "409T-SC.png"
		},
		"Empire Tie Back Scrub Top.jpeg" => {
			sku: "420T",
			description: "<p>This ultra feminine scrub top features an empire waist and ties at the back. Keeping with tradition this top has a v-neck collar and two front pockets</p>",
			colors: ["Navy", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "420T-SC.png"
		},
		"Ladies Zipper Detail Scrub Top.jpeg" => {
			sku: "530T",
			description: "<p>Fun, funky and fitted. This sporty scrub top features reflective trim, asymmetrical zipper detail, two lower pockets, one chest pocket and one shoulder pen pocket</p>",
			colors: ["NavyBlue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "530T-SC.png"
		},
		"V Neck Print Scrub Top.jpeg" => {
			sku: "320T",
			description: "<p>This classic printed v-neck scrub top is great for those who need to carry as many accessories as possible. A total of 5 front pockets offer a home for everything you need to carry throughout the day</p>",
			colors: ["BlueCheerios", "FireWorks", "FlowerPower", "HeartTies", "PinnedHeart", "SpringBlooming", 
								"Techno", "DizzyVines", "FlorescentButterfly", "GroovyHoops", "Papillon", "PrettyInPetals",
								"StringAlong"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "320T-SC.png"
		},
		"Criss Cross Scrub Top.jpeg" => {
			sku: "323T",
			description: "<p>Available in a large variety of prints and solid colors this scrub top will always be a top seller. Features a v-neck with a contrast color trim as well as two lower pockets and one shoulder pen pocket. This scrub top is also available as a set</p>",
			colors: ["Aqua/Black", "BlueCheerios/NavyBlue", "Charcoal/PostmanBlue", "Eggplant/Black", "FloresentButterfly/Charcoal",
								"Lagoon/Lagoon", "PostmanBlue/Navy", "SeaGreen/Navy", "SpringBlooming/Black" , "Techno/Aqua", 
								"Black/Aqua", "Charcoal/Lilac", "DeepOrchid/Black", "Fireworks/SeaGreen", "FlowerPower/RoyalBlue", 
								"Indigo/Charcoal", "NavyBlue/SkyBlue", "PrettyInPetals/Charcoal", "SkyBlue/Navy", 
								"StringAlong/Eggplant", "White/White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "323T-SC.png"
		},
		"Button Front Ladies Work Top.jpeg" => {
			sku: "201T",
			description: "<p>Button up in this ladies work top featuring 3 patch pockets, button front closure and a collar</p>",
			colors: ["Black", "White", "NavyBlue"],
			sizes: ["S", "M", "L", "XL", "2XL"],
			chart: "201T-SC.png"
		},
		"Ladies Long Sleeve Tee.jpeg" => {
			sku: "LT101",
			description: "<p>100% cotton, 100% comfort. This ladies long sleeve tee is made with pre-shrunk cotton and is perfect worn on it's own or layered under a scrub top. The top stitched collar gives it the strength and durability MOBB is known for</p>",
			colors: ["Black", "White", "NavyBlue"],
			sizes: ["S", "M", "L", "XL", "2XL"],
			chart: "LT101-SC.png"
		}
	}

	sets = {
		"Unisex 8 Pocket Drawstring Elastic Scrub Set.jpeg" => {
			sku: "310/307",
			description: "<p>Amazing fit in every MOBB color imaginable. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>
<p><strong>Size 5XL only available in Colors: Black, Charcoal, Burgundy, Caribbean, Lagoon, Navy, PostmanBlue, Royal Blue</p></strong>
<p><strong>Size 6XL only available in Navy</p></strong>",
			colors: ["Aqua","Burgundy","Caribbean","Charcoal","Khaki","LimeGreen","OliveGreen","RoyalBlue","Spruce",
								"White","Black","Cappuccino","Ceil","Eggplant","Lagoon","NavyBlue","PostmanBlue","SkyBlue","Teal"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"]
		},
		"Unisex 5 Pocket Drawstring Scrub Set.jpeg" => {
			sku: "606/608",
			description: "<p>MOBB's newest style, this scrub set replaces the 306/306. A classic v-neck scrub top with one chest pocket and one shoulder pen pocket and a simple five pocket drawstring pant. This set is ideal for school programs.</p>",
			colors: ["Black","Cappuccino","Ceil","Lagoon","PostmanBlue","SkyBlue","Burgundy","Caribbean","Charcoal",
								"NavyBlue","RoyalBlue","White"],
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
			colors: ["Burgundy/Navy", "Khaki/Black", "Charcoal/Black", "PostmanBlue/Navy"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"Childrens Scrub Set.jpeg" => {
			sku: "CH400",
			description: "<p>Mobb's High Quality Children's Scrub Set</p>",
			colors: ["Lagoon"],
			sizes: ["2Y","4Y","6Y","8Y"]
		}
	}

	pants = {
		"FLEXI WAIST SCRUB PANT.jpeg" => {
			sku: "416P",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: ["PostmanBlue", "SkyBlue", "Black", "Navy", "Charcoal"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "416P-SC.png"
		},
		"COMFORT RISE DRAWSTRING ELASTIC SCRUB PANT.jpeg" => {
			sku: "412P",
			description: "<p>This pant is the perfect combination of function and flow. The waistband is both elastic and drawstring making it comfortable at any rise. It has multiple pockets including a pocket for scissors and features multi-needle stitching for durability.<p>
										<p><strong>Regular Length (31” inseam) Sizes XS - 2XL</p><br><p>Available in all colours shown below</p><p>Petite Length (28” inseam) Sizes XS - 2XL
										Available in Black & Navy only</p><br><p>Tall Length (36” inseam) Sizes XS - 2XL
										Available in Black, Navy & Charcoal only</p>",
			colors: ["Eggplant", "Navy", "PostmanBlue", "Navy", "Charcoal"],
			sizes: ["XS", "S", "M", "L", "XL"],
			chart: "412P-SC.png"
		},
		"UNISEX DRAWSTRING SCRUB PANT WITH 5 POCKETS.jpeg" => {
			sku: "608P",
			description: "<p>The newest addition to the MOBB line, this pant is all about classic simplicity. Features a standard drawstring and five pockets. This pant mates perfectly with the 606T and is a favorite among school programs.<p>",
			colors: ["Black", "SkyBlue", "Burgundy", "Caribbean", "Charcoal", "Ceil", "Lagoon", "Navy", "PostmanBlue", "RoyalBlue", "White", "Cappuccino"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"],
			chart: "608P-SC.png"
		},
		"BOOT CUT FLIP FLAP SCRUB PANT.jpeg" => {
			sku: "312P",
			description: "<p>Fabulous fit and classic style. This five pocket boot cut pant features our signature MOBB logo waistband that can be flipped down for a lower rise. This is the pant that everyone's talking about.<p>",
			colors: ["Aqua", "Black", "Burgundy", "Caribbean", "Charcoal", "Ceil", "DeepOrchid", "Eggplant", "Indigo", "Khaki", "Lagoon", "Navy", "PostmanBlue", "Raspberry", "RoyalBlue", "SkyBlue", "Spruce", "White", "Cappuccino", "LimeGreen", "PinkSorbet"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "312P-SC.png"
		},
		"SIX POCKET CARGO PANT.jpeg" => {
			sku: "409P",
			description: "<p>Strong and versatile this pant is all business. Six pockets including two expandable side cargo pockets and a built in belt buckle.<p>",
			colors: ["Navy", "Black"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
			chart: "409P-SC.png"
		},
		"BELL BOTTOM SCRUB PANT.jpeg" => {
			sku: "302P",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: ["Navy", "Black", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "302P-SC.png"
		},
		"UNISEX DRAWSTRING ELASTIC 5 POCKET SCRUB PANT.jpeg" => {
			sku: "307P",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: ["Black", "Aqua", "Eggplant", "Burgundy", "Caribbean", "Charcoal", "Khaki", "Lagoon", "Navy", "OliveGreen", "PostmanBlue", "RoyalBlue", "SkyBlue", "Teal", "White", "Ceil", "Cappuccino"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			chart: "307P-SC.png"
		},
		"TALL DRAWSTRING ELASTIC SCRUB PANT.jpeg" => {
			sku: "309PTALL",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: ["Black", "Caribbean", "Charcoal", "Navy", "PostmanBlue", "RoyalBlue", "Spruce"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
			chart: "309PTALL-SC.png"
		},
		"LOW RISE LACE UP FLARE PANT.jpeg" => {
			sku: "316P",
			description: "<p>THIS SCRUB PANT IS GREAT FOR THOSE LOOKING FOR SOMETHING A LITTLE MORE FASHION FORWARD THAN THE TRADITIONAL SCRUB PANT. NO ELASTIC OR DRAWSTRING THIS PANT FEATURES A DECORATIVE LACE UP, LOW RISE WAIST AND FLARED BOTTOM.<p>",
			colors: ["Charcoal/Black", "Navy/Red", "Black/DustyRose"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "316P-SC.png"
		},
		"SCRUB SHORTS.jpeg" => {
			sku: "304P",
			description: "<p>THE MOBB SCRUB SHORT IS EASY AND COMFORTABLE. PERFECT FOR WARM WORK ENVIRONMENTS. FEATURES AN ELASTIC WAISTBAND, A CONSERVATIVE KNEE LENGTH AND TWO SIDE POCKETS.<p>",
			colors: ["Black", "Navy", "White"],
			sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
			chart: "304P-SC.png"
		},
		"FLEX WAIST SCRUB PANT TALL 36 INCH.jpeg" => {
			sku: "416PT36IN",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: ["Black", "NavyBlue", "Charcoal", "PostmanBlue", "SkyBlue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "416PT36IN-SC.png"
		},
		"FLEXI WAIST PETITE SCRUB PANT.jpeg" => {
			sku: "416PT28IN",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: ["Black", "NavyBlue", "Charcoal"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "416PT28IN-SC.png"
		},
		"COMFORT RISE DRAWSTRING ELASTIC PETITE SCRUB PANT.jpeg" => {
			sku: "412PT28IN",
			description: "<p>This pant is the perfect combination of function and flow. The waistband is both elastic and drawstring making it comfortable at any rise. It has multiple pockets including a pocket for scissors and features multi-needle stitching for durability.<p>",
			colors: ["Black", "NavyBlue"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "412PT28IN-SC.png"
		}
	}

	mentalitysf = {
		"The Rosey.jpeg" => {
			sku: "T3030",
			description: "<p>Simplicity at its best, this classic v-neck top is designed with a double stitched 
			detail line across the chest and two tailored lines down the back. Two lower patch pockets,
			the right side is enclosed with inner sectional pockets.The top is finished off with two small side 
			slits and a convenient shoulder pen pocket.</p><p>Stretch-Flex Blend: 65% Poly/32% Rayon/3% Spandex</p>",
			colors: ["Black", "RoyalBlue", "Charcoal", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"The Pearl.jpeg" => {
			sku: "T3020",
			description: "<p>Tailored for fit, this v-neck top features two flex side panels, one shoulder pen 
			pocket and two lower patch pockets. One of the patch pockets includes detailed stitching on the 
			outside with a utility D-ring and an inner smart phone pocket.</p><p>*Stretch-Flex Blend: 
			65% Poly/32% Rayon/3% Spandex</p>",
		  colors: ["Black", "RoyalBlue", "Charcoal", "White"],
		  sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL"]
		},
		"THE CARMEN.jpeg" => {
			sku: "P3011",
			description: "<p>Made for comfort, this straight leg pant is equipped with two front pockets, one back pocket and a cargo pocket with a utility D-ring. The combination drawstring/ elastic waistband will ensure ultimate fit and comfort. The inner waistband features MOBB’s signature logo.</p>",
			colors: ["Black", "Charcoal", "RoyalBlue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "P3011-SC.png"
		}
	}

	mentalityh = {
		"THE SHANNEL.jpeg" => {
			sku: "P1011",
			description: "<p>A clean and classic straight leg pant featuring front-to-back, wrap-around cargo pockets, two slant pockets and a combination drawstring elastic waist.</p>",
			colors: ["Aubergine", "SoftMint", "Black", "Charcoal", "DeepOrchid", "NavyBlue", "White"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "P1011-SC.png"
		},
		"THE MESSENGER.jpeg" => {
			sku: "P1011",
			description: "<p>A clean and classic straight leg pant featuring front-to-back, wrap-around cargo pockets, two slant pockets and a combination drawstring elastic waist.</p>",
			colors: ["Black", "Charcoal", "NavyBlue"],
			sizes: ["XS", "S", "M", "L", "XL", "2XL"],
			chart: "P1011-SC.png"
		},
		"The Coco.jpeg" => {
			sku: "T1018",
			description: "<p>A stunning v-neck top with an hourglass silhouette. Featuring flex sleeves and side panels with a gathered cap sleeve detail, 
			two hidden pockets and custom tailoring for an exceptional fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex<p>",
			colors: ["Aubergine", "White", "SoftMint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "T1018-SC.png"
		},
		"The Mandy.jpeg" => {
			sku: "T1010",
			description: "<p>A unique style and ultra chic fit, this deep cut mandarin neckline features two lower pockets, flex side panels and has 
			beautiful tailoring through the back for a custom fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: ["Aubergine", "White", "SoftMint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "T1010-SC.png"
		},
		"The Roxy.jpeg" => {
			sku: "T1016",
			description: "<p>A fit for fashion and function, this top features flex sleeves and side panels, a gathered cap sleeve detail, 
			chest darts and two hidden pockets.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: ["Aubergine", "White", "SoftMint"],
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL"],
			chart: "T1016-SC.png"
		},
	}

	clearance = {
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Lagoon.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Lagoon"],
			sizes: ["XXS", "XS", "M", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Lilac.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Lilac"],
			sizes: ["XXS", "XS", "M", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Navy.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Navy"],
			sizes: ["XXS", "XS", "M", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Royal Blue.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["RoyalBlue"],
			sizes: ["XXS", "XS", "M", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set White.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["White"],
			sizes: ["XXS", "XS", "M", "XL", "2XL", "3XL", "4XL"]
		},
		"Criss Cross Flip Flap Aqua.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Aqua"],
			sizes: ["2XL"]
		},
		"Criss Cross Flip Flap Black With Dusty Rose Trim.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Black/DustyRose"],
			sizes: ["2XL"]
		},
		"Criss Cross Flip Flap Black and Aqua.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Black/Aqua"],
			sizes: ["2XL"]
		},
		"Criss Cross Flip Flap Brown.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Brown"],
			sizes: ["XXS", "XS", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Bubble Gum.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["BubbleGum"],
			sizes: ["S", "M", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Dusty Rose.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["DustyRose"],
			sizes: ["XXS", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Dusty Rose With Polka Dots.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["DustyRose/PolkaDots"],
			sizes: ["XXS", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Khaki.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Khaki"],
			sizes: ["L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Lime Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Lime Green"],
			sizes: ["L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Nutmeg.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Khaki"],
			sizes: ["S", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Olive Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["OliveGreen"],
			sizes: ["L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Pink.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Pink"],
			sizes: ["XXS", "XS", "M", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Postman Blue.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["PostmanBlue"],
			sizes: ["2XL"]
		},
		"Criss Cross Flip Flap Red.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Red"],
			sizes: ["XXS", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap Sea Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["SeaGreen"],
			sizes: ["L"]
		},
		"Criss Cross Flip Flap Sky Blue.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["SkyBlue"],
			sizes: ["XL", "2XL"]
		},
		"Criss Cross Flip Flap Tangerine.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["Tangerine"],
			sizes: ["XXS", "L", "XL", "2XL"]
		},
		"Criss Cross Flip Flap White.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: ["White"],
			sizes: ["XL", "2XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Brick.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Brick"],
			sizes: ["XXS", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Brown.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Brown"],
			sizes: ["XXS", "XS", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Dusty Rose.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["DustyRose"],
			sizes: ["XS", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Lilac.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Lilac"],
			sizes: ["XXS", "XS", "M", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Lime Green.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["LimeGreen"],
			sizes: ["XS", "M", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Pink.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Pink"],
			sizes: ["XXS", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Red.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Red"],
			sizes: ["XS", "S", "L", "XL"]
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Tangerine.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: ["Tangerine"],
			sizes: ["XXS", "XS", "L", "XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Burgundy.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Burgundy"],
			sizes: ["L", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Caribbean.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Caribbean"],
			sizes: ["S", "L", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Ceil.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Ceil"],
			sizes: ["XXS", "XS", "L", "XL", "2XL", "3XL", "4XL"]
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Khaki.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: ["Khaki"],
			sizes: ["XXS", "XS", "S", "M", "L", "2XL", "3XL", "4XL"]
		}
	}

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

				if params[:chart]
					f = File.open(File.join(Rails.root, 'db', 'seeds_data', 'sc', params[:chart]))
					s = Stylechart.create!(image: f, product_id: pro.id)
					p s 
				end

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

		elsif params = clearance[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-CLEARANCE-#{color}"))
				pro.product_category = cat6
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

		elsif params = pants[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-#{color}"))
				pro.product_category = cat3
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

				if params[:chart]
					f = File.open(File.join(Rails.root, 'db', 'seeds_data', 'sc', params[:chart]))
					s = Stylechart.create!(image: f, product_id: pro.id)
					p s 
				end

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

		elsif params = mentalityh[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-#{color}"))
				pro.product_category = cat20
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

				if params[:chart]
					f = File.open(File.join(Rails.root, 'db', 'seeds_data', 'sc', params[:chart]))
					s = Stylechart.create!(image: f, product_id: pro.id)
					p s 
				end

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

		elsif params = mentalitysf[filename] 

				params[:colors].each do |color|

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], sku: params[:sku], name: "#{name}-#{color}"))
				pro.product_category = cat21
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

				if params[:chart]
					f = File.open(File.join(Rails.root, 'db', 'seeds_data', 'sc', params[:chart]))
					s = Stylechart.create!(image: f, product_id: pro.id)
					p s 
				end

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
  end
end

def country
	Shoppe::Country.destroy_all
	Shoppe::Country.create(name: "Canada", code2: 'CA', code3: 'CAN', continent: 'NA', tld: 'ca')
end

seed_shit
country