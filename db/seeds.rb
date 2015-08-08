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

def get_style(stylename, content_type = 'image/png')
  file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.open(File.join(Rails.root, 'db', 'seeds_data', 'sc', stylename), 'rb'))
  file.original_filename = File.basename(stylename, File.extname(stylename))
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
			price: "18.49",
			weight: 0.3,
			colors: "Black,Cappuccino,Ceil,Lagoon,PostmanBlue,SkyBlue,Burgundy,Caribbean,Charcoal,NavyBlue,RoyalBlue,White",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL,5XL",
			chart: "606T-SC.png"
		},
		"Zipper Front Ladies Work Top.jpeg" => {
			sku: "202T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			price: "19.99",
			weight: 0.3,
			colors: "Black,White,NavyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			chart: "202T-SC.png"
		},
		"Flexi V Neck Scrub Top.jpeg" => {
			sku: "324T",
			description: "<p>Zip up in this ladies work top featuring 2 patch pockets, a zip front closure and a collar</p>",
			price: "19.99",
			weight: 0.3,
			colors: "2toneWhite,Black,Brown,Charcoal,DejaVu,Eggplant,HeartTies,Khaki,
							 LimeGreen,OliveGreen,Papillon,PostmanBlue,Raspberry,RoyalBlue,StringAlong,
							 ZenStem,Aqua,BlueCheerios,Cappuccino,DeepOrchid,DustyRose,FireWorks,Indigo,
							 Lagoon,NavyBlue,PaisleyPink,PinkSorbet,PrettyInPetals,Red,SeaGreen,
							 Techno",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			chart: "324T-SC.png"
		},
		"Ultra Flexi Scrub Top.jpeg" => {
			sku: "524T",
			description: "<p>The Ultra Flexi scrub top has multiple black stretch panels for the most superb fit 
			and ultimate movement.The Ultra Flexi v-neck top also has two lower pockets and one shoulder pen pocket.</p>",
			colors: "Aqua,Charcoal,NavyBlue,Black,DeepOrchid,SkyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "22.50",
			weight: 0.3,
			chart: "524T-SC.png"
		},
		"3 Pocket V Neck Scrub Top.jpeg" => {
			sku: "308T",
			description: "<p>A bold, basic 3 pocket v-neck scrub top featuring dolman sleeves. This scrub top is also available as a set</p>",
			colors: "Aqua,Burgundy,Ceil,Eggplant,Lagoon,PostmanBlue, 
								RoyalBlue,Spruce,Black,Caribbean,Charcoal,Khaki, 
								NavyBlue,Rasberry,SkyBlue,White",
			sizes: "XXS,XS,S,M,L,XL",
			price: "22.50",
			weight: 0.3,
			chart: "308T-SC.png"
		},
		"Unisex V Neck Scrub Top.jpeg" => {
			sku: "310T",
			description: "<p>A classic v-neck scrub top popular among men and women. This top has a slightly longer hem 
			line making it an excellent choice for anyone with a taller stature. This top has three front pockets, one shoulder 
			pen pocket and is available in every MOBB color</p>",
			colors: "Aqua,Burgundy,Caribbean,Charcoal,Khaki,NavyBlue,PostmanBlue,RoyalBlue, 
								SkyBlue,Teal,Black,Cappuccino,Ceil,Eggplant,Lagoon,OliveGreen,Red,
								SeaGreen,Spruce,White",
			price: "18.99",
			weight: 0.3,
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL",
			chart: "310T-SC.png"
		},
		"Ladies Sculpted Scrub Top.jpeg" => {
			sku: "410T",
			description: "<p>A simple twist on our classic neckline. This scrub top features a beautifully sculpted wave neckline 
			with contrasting color. The top also has two lower pockets, one chest pocket and one shoulder pen pocket.</p>",
			colors: "Aqua/Black,Charcoal/PostmanBlue,Eggplant/Black,White/White, 
								Black/White,DeepOrchid/White,NavyBlue/SkyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			weight: 0.3,
			chart: "410T-SC.png"
		},
		"Active Flexi V Neck Scrub Top.jpeg" => {
			sku: "424T",
			description: "<p>Comfortable and stylish this scrub top feels and looks amazing. The stretch panels create a fantastic fit 
			and allow for great movement. The flexi v-neck has two lower pockets and one shoulder pen pocket</p>",
			colors: "Indigo/Black,Eggplant/Black,Rasberry/Black,Aqua/Black,Charcoal/Black,NavyBlue/Black,
								White/White,PostmanBlue/Black",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "21.75",
			weight: 0.3,
			chart: "424T-SC.png"
		},
		"Mens Two Tone Scrub Top.jpeg" => {
			sku: "409T",
			description: "<p>Available in four color-ways this scrub top is becoming a favorite among men in the medical field. 
			This two-tone scrub top has one chest pocket and one shoulder pen pocket. Also available as a set with the 409P</p>",
			colors: "Burgundy/Navy,Khaki/Black,Charcoal/Black,PostmanBlue/Navy",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			price: "21.49",
			weight: 0.3,
			chart: "409T-SC.png"
		},
		"Empire Tie Back Scrub Top.jpeg" => {
			sku: "420T",
			description: "<p>This ultra feminine scrub top features an empire waist and ties at the back. Keeping with tradition this top has a v-neck collar and two front pockets</p>",
			colors: "Navy,White",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "21.99",
			weight: 0.3,
			chart: "420T-SC.png"
		},
		"Ladies Zipper Detail Scrub Top.jpeg" => {
			sku: "530T",
			description: "<p>Fun, funky and fitted. This sporty scrub top features reflective trim, asymmetrical zipper detail, two lower pockets, one chest pocket and one shoulder pen pocket</p>",
			colors: "NavyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			price: "18.99",
			weight: 0.3,
			chart: "530T-SC.png"
		},
		"V Neck Print Scrub Top.jpeg" => {
			sku: "320T",
			description: "<p>This classic printed v-neck scrub top is great for those who need to carry as many accessories as possible. A total of 5 front pockets offer a home for everything you need to carry throughout the day</p>",
			colors: "BlueCheerios,FireWorks,FlowerPower,HeartTies,PinnedHeart,SpringBlooming, 
								Techno,DizzyVines,FlorescentButterfly,GroovyHoops,Papillon,PrettyInPetals,
								StringAlong",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			price: "19.99",
			weight: 0.3,
			chart: "320T-SC.png"
		},
		"Criss Cross Scrub Top.jpeg" => {
			sku: "323T",
			description: "<p>Available in a large variety of prints and solid colors this scrub top will always be a top seller. Features a v-neck with a contrast color trim as well as two lower pockets and one shoulder pen pocket. This scrub top is also available as a set</p>",
			colors: "Aqua/Black,BlueCheerios/NavyBlue,Charcoal/PostmanBlue,Eggplant/Black,FloresentButterfly/Charcoal,
								Lagoon/Lagoon,PostmanBlue/Navy,SeaGreen/Navy,SpringBlooming/Black,Techno/Aqua, 
								Black/Aqua,Charcoal/Lilac,DeepOrchid/Black,Fireworks/SeaGreen,FlowerPower/RoyalBlue, 
								Indigo/Charcoal,NavyBlue/SkyBlue,PrettyInPetals/Charcoal,SkyBlue/Navy, 
								StringAlong/Eggplant,White/White",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "17.95",
			weight: 0.3,
			chart: "323T-SC.png"
		},
		"Button Front Ladies Work Top.jpeg" => {
			sku: "201T",
			description: "<p>Button up in this ladies work top featuring 3 patch pockets, button front closure and a collar</p>",
			colors: "Black,White,NavyBlue",
			sizes: "S,M,L,XL,2XL",
			price: "19.99",
			weight: 0.3,
			chart: "201T-SC.png"
		},
		"Ladies Long Sleeve Tee.jpeg" => {
			sku: "LT101",
			description: "<p>100% cotton, 100% comfort. This ladies long sleeve tee is made with pre-shrunk cotton and is perfect worn on it's own or layered under a scrub top. The top stitched collar gives it the strength and durability MOBB is known for</p>",
			colors: "Black,White,NavyBlue",
			sizes: "S,M,L,XL,2XL",
			price: "19.99",
			weight: 0.3,
			chart: "LT101-SC.png"
		}
	}

	sets = {
		"Unisex 8 Pocket Drawstring Elastic Scrub Set.jpeg" => {
			sku: "310/307",
			description: "<p>Amazing fit in every MOBB color imaginable. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>
<p><strong>Size 5XL only available in Colors: Black, Charcoal, Burgundy, Caribbean, Lagoon, Navy, PostmanBlue, Royal Blue</p></strong>
<p><strong>Size 6XL only available in Navy</p></strong>",
			colors: "Aqua,Burgundy,Caribbean,Charcoal,Khaki,LimeGreen,OliveGreen,RoyalBlue,Spruce,
								White,Black,Cappuccino,Ceil,Eggplant,Lagoon,NavyBlue,PostmanBlue,SkyBlue,Teal",
			price: "35.75",
			weight: 0.7,
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL,5XL"
		},
		"Unisex 5 Pocket Drawstring Scrub Set.jpeg" => {
			sku: "606/608",
			description: "<p>MOBB's newest style, this scrub set replaces the 306/306. A classic v-neck scrub top with one chest pocket and one shoulder pen pocket and a simple five pocket drawstring pant. This set is ideal for school programs.</p>",
			colors: "Black,Cappuccino,Ceil,Lagoon,PostmanBlue,SkyBlue,Burgundy,Caribbean,Charcoal,
								NavyBlue,RoyalBlue,White",
			price: "34.99",
			weight: 0.7,
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL"
		},
		"Reversible O R Drawstring Scrub Set.jpeg" => {
			sku: "306TA/306PA",
			description: "<p>Available for special programs, this scrub set was designed to meet the needs of hospital O.R. staff. A unisex, reversible, drawstring scrub set featuring a color code size indicator on the chest pocket and a simple drawstring scrub pant with one back pocket.</p>",
			colors: "Lagoon",
			price: "34.99",
			weight: 0.7,
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL,5XL"
		},
		"Mens Two Tone Scrub Set with 6 Pocket Scrub Pants.jpeg" => {
			sku: "409/409",
			description: "<p>Becoming one of MOBB's best sellers. This Men's two tone v-neck has one chest pocket and one shoulder pen pocket and is available in four color-ways. The six pocket cargo scrub pant has a built in belt buckle and is available in black and navy.</p>",
			colors: "Burgundy/Navy,Khaki/Black,Charcoal/Black,PostmanBlue/Navy",
			price: "48.99",
			weight: 0.7,
			sizes: "XS,S,M,L,XL,2XL,3XL"
		},
		"Childrens Scrub Set.jpeg" => {
			sku: "CH400",
			description: "<p>Mobb's High Quality Children's Scrub Set</p>",
			colors: "Lagoon",
			price: "18.99",
			weight: 0.7,
			sizes: "2Y,4Y,6Y,8Y"
		}
	}

	pants = {
		"FLEXI WAIST SCRUB PANT.jpeg" => {
			sku: "416P",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: "PostmanBlue,SkyBlue,Black,Navy,Charcoal",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "23.99",
			weight: 0.4,
			chart: "416P-SC.png"
		},
		"COMFORT RISE DRAWSTRING ELASTIC SCRUB PANT.jpeg" => {
			sku: "412P",
			description: "<p>This pant is the perfect combination of function and flow. The waistband is both elastic and drawstring making it comfortable at any rise. It has multiple pockets including a pocket for scissors and features multi-needle stitching for durability.<p>
										<p><strong>Regular Length (31” inseam) Sizes XS - 2XL</p><br><p>Available in all colours shown below</p><p>Petite Length (28” inseam) Sizes XS - 2XL
										Available in Black & Navy only</p><br><p>Tall Length (36” inseam) Sizes XS - 2XL
										Available in Black, Navy & Charcoal only</p>",
			colors: ["Eggplant,Navy,PostmanBlue,Charcoal"],
			sizes: ["XS,S,M,L,XL"],
			price: "24.99",
			weight: 0.4,
			chart: "412P-SC.png"
		},
		"UNISEX DRAWSTRING SCRUB PANT WITH 5 POCKETS.jpeg" => {
			sku: "608P",
			description: "<p>The newest addition to the MOBB line, this pant is all about classic simplicity. Features a standard drawstring and five pockets. This pant mates perfectly with the 606T and is a favorite among school programs.<p>",
			colors: "Black,SkyBlue,Burgundy,Caribbean,Charcoal,Ceil,Lagoon,Navy,PostmanBlue,RoyalBlue,White,Cappuccino",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL",
			price: "19.99",
			weight: 0.4,
			chart: "608P-SC.png"
		},
		"BOOT CUT FLIP FLAP SCRUB PANT.jpeg" => {
			sku: "312P",
			description: "<p>Fabulous fit and classic style. This five pocket boot cut pant features our signature MOBB logo waistband that can be flipped down for a lower rise. This is the pant that everyone's talking about.<p>",
			colors: "Aqua,Black,Burgundy,Caribbean,Charcoal,Ceil,DeepOrchid,Eggplant,Indigo,Khaki,Lagoon,Navy,PostmanBlue,Raspberry,RoyalBlue,SkyBlue,Spruce,White,Cappuccino,LimeGreen,PinkSorbet",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "21.99",
			weight: 0.4,
			chart: "312P-SC.png"
		},
		"SIX POCKET CARGO PANT.jpeg" => {
			sku: "409P",
			description: "<p>Strong and versatile this pant is all business. Six pockets including two expandable side cargo pockets and a built in belt buckle.<p>",
			colors: "Navy,Black",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL",
			price: "28.99",
			weight: 0.4,
			chart: "409P-SC.png"
		},
		"BELL BOTTOM SCRUB PANT.jpeg" => {
			sku: "302P",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: "Navy,Black,White",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "18.99",
			weight: 0.4,
			chart: "302P-SC.png"
		},
		"UNISEX DRAWSTRING ELASTIC 5 POCKET SCRUB PANT.jpeg" => {
			sku: "307P",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: "Black,Aqua,Eggplant,Burgundy,Caribbean,Charcoal,Khaki,Lagoon,Navy,OliveGreen,PostmanBlue,RoyalBlue,SkyBlue,Teal,White,Ceil,Cappuccino",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL,5XL",
			price: "21.99",
			weight: 0.4,
			chart: "307P-SC.png"
		},
		"TALL DRAWSTRING ELASTIC SCRUB PANT.jpeg" => {
			sku: "309PTALL",
			description: "<p>This scrub pant is simple with a twist. Two front pockets and one back pocket. Drawstring closure at the front with an elastic cinch at the back and a bell bottom flare at the bottom.<p>",
			colors: "Black,Caribbean,Charcoal,Navy,PostmanBlue,RoyalBlue,Spruce",
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL,5XL",
			price: "21.99",
			weight: 0.4,
			chart: "309PTALL-SC.png"
		},
		"LOW RISE LACE UP FLARE PANT.jpeg" => {
			sku: "316P",
			description: "<p>THIS SCRUB PANT IS GREAT FOR THOSE LOOKING FOR SOMETHING A LITTLE MORE FASHION FORWARD THAN THE TRADITIONAL SCRUB PANT. NO ELASTIC OR DRAWSTRING THIS PANT FEATURES A DECORATIVE LACE UP, LOW RISE WAIST AND FLARED BOTTOM.<p>",
			colors: "Charcoal/Black,Navy/Red,Black/DustyRose",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "22.99",
			weight: 0.4,
			chart: "316P-SC.png"
		},
		"SCRUB SHORTS.jpeg" => {
			sku: "304P",
			description: "<p>THE MOBB SCRUB SHORT IS EASY AND COMFORTABLE. PERFECT FOR WARM WORK ENVIRONMENTS. FEATURES AN ELASTIC WAISTBAND, A CONSERVATIVE KNEE LENGTH AND TWO SIDE POCKETS.<p>",
			colors: "Black,Navy,White",
			sizes: "S,M,L,XL,2XL,3XL",
			price: "19.99",
			weight: 0.4,
			chart: "304P-SC.png"
		},
		"FLEX WAIST SCRUB PANT TALL 36 INCH.jpeg" => {
			sku: "416PT36IN",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: "Black,NavyBlue,Charcoal,PostmanBlue,SkyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "24.99",
			weight: 0.4,
			chart: "416PT36IN-SC.png"
		},
		"FLEXI WAIST PETITE SCRUB PANT.jpeg" => {
			sku: "416PT28IN",
			description: "<p>The flexible waist provides comfort and style even for expectant mothers. This pant features side, back and cargo pockets.<p>",
			colors: "Black,NavyBlue,Charcoal",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "23.99",
			weight: 0.4,
			chart: "416PT28IN-SC.png"
		},
		"COMFORT RISE DRAWSTRING ELASTIC PETITE SCRUB PANT.jpeg" => {
			sku: "412PT28IN",
			description: "<p>This pant is the perfect combination of function and flow. The waistband is both elastic and drawstring making it comfortable at any rise. It has multiple pockets including a pocket for scissors and features multi-needle stitching for durability.<p>",
			colors: "Black,NavyBlue",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "24.99",
			weight: 0.4,
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
			colors: "Black,RoyalBlue,Charcoal,White",
			price: "29.99",
			weight: 0.3,
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL"
		},
		"The Pearl.jpeg" => {
			sku: "T3020",
			description: "<p>Tailored for fit, this v-neck top features two flex side panels, one shoulder pen 
			pocket and two lower patch pockets. One of the patch pockets includes detailed stitching on the 
			outside with a utility D-ring and an inner smart phone pocket.</p><p>*Stretch-Flex Blend: 
			65% Poly/32% Rayon/3% Spandex</p>",
		  colors: "Black,RoyalBlue,Charcoal,White",
		  price: "29.99",
		  weight: 0.3,
		  sizes: "XXS,XS,S,M,L,XL,2XL,3XL"
		},
		"THE CARMEN.jpeg" => {
			sku: "P3011",
			description: "<p>Made for comfort, this straight leg pant is equipped with two front pockets, one back pocket and a cargo pocket with a utility D-ring. The combination drawstring/ elastic waistband will ensure ultimate fit and comfort. The inner waistband features MOBB’s signature logo.</p>",
			colors: "Black,Charcoal,RoyalBlue,White",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "42.99",
			weight: 0.3,
			chart: "P3011-SC.png"
		}
	}

	mentalityh = {
		"THE SHANNEL.jpeg" => {
			sku: "P1011",
			description: "<p>A clean and classic straight leg pant featuring front-to-back, wrap-around cargo pockets, two slant pockets and a combination drawstring elastic waist.</p>",
			colors: "Aubergine,SoftMint,Black,Charcoal,DeepOrchid,NavyBlue,White",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "28.99",
			weight: 0.3,
			chart: "P1011-SC.png"
		},
		"THE MESSENGER.jpeg" => {
			sku: "P1013",
			description: "<p>A clean and classic straight leg pant featuring front-to-back, wrap-around cargo pockets, two slant pockets and a combination drawstring elastic waist.</p>",
			colors: "Black,Charcoal,NavyBlue",
			sizes: "XS,S,M,L,XL,2XL",
			price: "22.99",
			weight: 0.3,
			chart: "P1011-SC.png"
		},
		"The Coco.jpeg" => {
			sku: "T1018",
			description: "<p>A stunning v-neck top with an hourglass silhouette. Featuring flex sleeves and side panels with a gathered cap sleeve detail, 
			two hidden pockets and custom tailoring for an exceptional fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex<p>",
			colors: "Aubergine,White,SoftMint",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "18.99",
			weight: 0.3,
			chart: "T1018-SC.png"
		},
		"The Mandy.jpeg" => {
			sku: "T1010",
			description: "<p>A unique style and ultra chic fit, this deep cut mandarin neckline features two lower pockets, flex side panels and has 
			beautiful tailoring through the back for a custom fit.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: "Aubergine,White,SoftMint",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "18.99",
			weight: 0.3,
			chart: "T1010-SC.png"
		},
		"The Roxy.jpeg" => {
			sku: "T1016",
			description: "<p>A fit for fashion and function, this top features flex sleeves and side panels, a gathered cap sleeve detail, 
			chest darts and two hidden pockets.</p><p>*Hy-Stretch Blend: 65% Poly/32% Cotton/3% Spandex</p>",
			colors: "Aubergine,White,SoftMint",
			sizes: "XXS,XS,S,M,L,XL,2XL",
			price: "18.99",
			weight: 0.3,
			chart: "T1016-SC.png"
		},
	}

	fireretardent = {
		"NOMEX IIIA INSULATED FLAME RESISTANT COVERALL WORKSUIT.jpeg" => {
			sku: "FR60W",
			description: "<p>Nomex® is the go-to fabric for MOBB when manufacturing products for industrial workers. Our insulated coverall worksuit has a detachable hood and 3M Scotchlite reflective tape to enhance visibility. Includes a 2-way Vislon Nomex® front zipper, 2 ankle zippers as well a handy pen pocket. Featuring 100% Meta-Aramid 15oz lining, quilted to 100% Aramid with 100% Polyester moisture barrier and 100% FR Polyurethane wind barrier film</p>",
			colors: "NavyBlue,RoyalBlue",
			price: "199.99",
			weight: 0.6,
			sizes: "38,40,42,44,46,48,50,52,54,56"
		},
		"NOMEX IIIA INSULATED FLAME RESISTANT BIB PANT.jpeg" => {
			sku: "FR50W",
			description: "<p>MOBB is proud to use Nomex® fiber in all of our FR clothing because we know it remains the first choice for workers who rely on  flame resistant properties to help keep them safe from the everyday hazards they face. The insulated bib pant features 2-way Vislon Nomex® front and leg zippers with snap down covers, adjustable FR elastic shoulder straps and 3M Scotchlite reflective tape for enhanced visibility</p>",
			colors: "NavyBlue,RoyalBlue",
			price: "209.99",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"NOMEX IIIA INSULATED FLAME RESISTANT PARKA.jpeg" => {
			sku: "FR40W",
			description: "<p>MOBB chooses NOMEX® for all of our FR clothing because they offer the ultimate protection. A tough outer shell with cut and flame resistance, a moisture barrier preventing the penetration of liquid and a thermal liner providing sufficient insulation while not restricting mobility. The insulated parka features a detachable hood, 2 chest pockets, 2 lower front pockets, all with flaps and covered snap closures. Includes Vislon Nomex® zipper and 3M Scotchlite reflective tape</p>",
			colors: "NavyBlue,RoyalBlue",
			price: "199.99",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"INDURA ULTRA SOFT INSULATED COVERALL WORKSUIT.jpeg" => {
			sku: "FR30W",
			description: "<p>Lightweight comfort in a flame-resistant fabric. That's what you can expect with our Indura® Ultra-Soft® FR Insulated Coverall Worksuit. Features 100% FR treated cotton lining with a breathable vapour barrier, 3M Scotchlite reflective tape. Includes 2-way Vislon Nomex® front zipper, 2 ankle zippers and a handy pen pocket</p>",
			colors: "NavyBlue,RoyalBlue",
			price: "199.99",
			weight: 0.6,
			sizes: "38,40,42,44,46,48,50,52,54,56"
		},
		"INDURA ULTRA SOFT INSULATED FLAME RESISTANT BIB PANT.jpeg" => {
			sku: "FR20W",
			description: "<p>The built-in flame resistance of NOMEX® provides outstanding protection as well as being a light weight comfortable garment. Our bib pant features 2-way Vislon Nomex® front zippers and leg zippers with snap down covers, adjustable FR elastic shoulder straps and 3M Scothchlite reflective tape</p>",
			colors: "NavyBlue",
			price: "179.99",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"INDURA ULTRA SOFT INSULATED FLAME RESISTANT PARKA.jpeg" => {
			sku: "FR10W",
			description: "<p>Indura® Ultra Soft® Parkas allow you to protect yourself and your crew from a number of potential injuries. These flame resistant jackets are proven to provide exceptional warmth and flame resistance. Features 2 chest pockets, 2 lower pockets, all with flaps and covered snap closures. Includes Vislon Nomex® zippers and 3M Scotchlite reflective tape</p>",
			colors: "NavyBlue,RoyalBlue",
			price: "174.99",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		}
	}

	workcoats = {
		"SHOP COAT.jpeg" => {
			sku: "SH200",
			description: "<p>Stay protected and comfortable throughout the work day in the MOBB shop coat, made with a heavyweight 7.5 oz poly-cotton blend for strong, snag-resistant wear. Features 3 patch pockets as well as side access openings, centre back vent, dome closure and a handy penpocket on the left arm</p>",
			colors: "NavyBlue,Spruce",
			price: "34.49",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"SHOP COAT II.jpeg" => {
			sku: "SH203",
			description: "<p>Stay protected and comfortable throughout the work day in the MOBB shop coat, made with a heavyweight 8.5 oz poly-cotton blend for strong, snag-resistant wear. Features 3 patch pockets as well as side access openings, centre back vent, dome closure and a handy penpocket on the left arm</p>",
			colors: "PostmanBlue",
			price: "34.99",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"SPUN POLY BLEND SHOP COAT.jpeg" => {
			sku: "SH201S",
			description: "<p>Made from a 7oz Spun Poly blend, each shop coat features 3 patch pockets as well as side access openings, centre back vent, dome button closure and left arm pen pocket</p>",
			colors: "White",
			price: "39.49",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"3 POCKET COTTON SHOP COAT.jpeg" => {
			sku: "SH200",
			description: "<p>Made from comfortable 100% cotton, this traditional MOBB shop coat offers convenience and utility with one chest and two lower pockets. Comfort and durability make this shop coat ideal for everything from customer service to industrial work environments. Also features a concealed dome button closure, side access openings, centre back vent and left arm pen pocket</p>",
			colors: "NavyBlue",
			price: "34.49",
			weight: 0.6,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
	}

	workshirts = {
		"LONG SLEEVE BUTTON FRONT WORK SHIRT.jpeg" => {
			sku: "S300",
			description: "<p>The MOBB Long Sleeve Button Front Work Shirt is made to last. Its heavyweight 65/35 poly/cotton 5 oz. fabric makes it both comfortable and durable. Features a button front closure with top snap and 2 patch pockets</p>",
			colors: "Ceil,Lagoon,NavyBlue",
			price: "16.99",
			weight: 0.3,
			sizes: "S,M,L,XL,2XL,3XL,4XL,5XL,6XL"
		},
		"SHORT SLEEVE BUTTON FRONT WORK SHIRT.jpeg" => {
			sku: "S301",
			description: "<p>The MOBB Short Sleeve Button Front Work Shirt is stylish and functional. Its heavyweight 65/35 poly/cotton 5 oz. fabric makes it both comfortable and durable. Features a button front closure with top snap and 2 patch pockets</p>",
			colors: "Ceil,Lagoon,NavyBlue",
			price: "16.99",
			weight: 0.3,
			sizes: "S,M,L,XL,2XL,3XL,4XL,5XL,6XL"
		}
	}

	caps = {
		"MOBB UNISEX DELUXE SURGEONS CAP.jpeg" => {
			sku: "SC500",
			description: "<p>A beautiful surgeon cap built with comfort in mind. Traditional 'tie back' style featuring a forehead moisture band. Available in assorted prints</p>",
			colors: "1STYLE",
			price: "10.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"BOUFFANT STYLE SURGEON CAP.JPEG" => {
			sku: "SC445",
			description: "<p>This hat is styled with a beautiful bouffant and is available is assorted prints and solid colors.
										Elastic back ensures a perfect fit for every head</p>",
			colors: "Ceil,FlowerPower",
			price: "12.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"MOBB UNISEX SURGEONS CAP.jpeg" => {
			sku: "SC440",
			description: "<p>This hat is the traditional 'tie back' style surgeon's cap. Available in assorted prints and solid colours.</p>",
			colors: "Blue,Pink,Purple,Red,Grey,HeartTies",
			price: "6.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"TRADITIONAL NURSE CAP.jpeg" => {
			sku: "NC",
			description: "<p>Classic white nurse cap, the perfect compliment to all traditional nurse uniforms</p>",
			colors: "White",
			price: "12.99",
			weight: 0.1,
			sizes: "1SIZE" 
		}
	}

	accessories = {
		"STETHOSCOPE CLIP.jpeg" => {
			sku: "STETHCLIP",
			description: "<p>The MOBB Stethoscope Clip was created by medical professionals for medical professionals. Sturdy, durable construction, made to last</p>",
			colors: "1STYLE",
			price: "8.49",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"PENLIGHT.jpeg" => {
			sku: "PL",
			description: "<p>The MOBB Penlight provides a bright, quality light, a pupil gauge and is an indispensable tool for diagnosis</p>",
			colors: "1STYLE",
			price: "4.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"PILL CUTTER CRUSHER DUO.jpeg" => {
			sku: "PL-CRUSHER",
			description: "<p>The MOBB Pill Cutter-Crusher Duo is a self-contained compliance device that is used to cut or crush pills and tablets to half-size or into powder for medication administration</p>",
			colors: "1STYLE",
			price: "9.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"MOBB PLUSH LOGO SLIPPERS.jpeg" => {
			sku: "A0002",
			description: "<p>Soft and cozy. Featuring the MOBB logo and a non-slip tread</p>",
			colors: "1STYLE",
			price: "9.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"MOBB MEASURING TAPE WITH PEN.JPEG" => {
			sku: "MMTWP",
			description: "<p>MOBB MEASURING TAPE WITH PEN</p>",
			colors: "1STYLE",
			price: "3.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"MOBB KEY CHAIN.jpeg" => {
			sku: "MKC-100",
			description: "<p>MOBB KEY CHAIN</p>",
			colors: "1STYLE",
			price: "3.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"PLUSH ANIMAL STETHOSCOPE COVERS.JPEG" => {
			sku: "PASC-100",
			description: "<p>Soft, fuzzy and completely adorable. The MOBB Plush Animal Stethoscope covers are sure to make everyone smile, especially the little ones. Select the options as color options.</p>",
			colors: "Hippo,Pig,Ant,Frog",
			price: "14.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"CLIP ON WATCHES.jpeg" => {
			sku: "COW-100",
			description: "<p>Key chains avilable in Smiley, Heart, Teddy Bear, and Health styles</p>",
			colors: "Smiley,Heart,TeddyBear,Health",
			price: "13.99",
			weight: 0.4,
			sizes: "1SIZE"
		},
		"BLOOD PRESSURE MONITOR.jpeg" => {
			sku: "KT-A07",
			description: "<p>Measure blood pressure with this lightweight and portable manual intalation monitor that offers both high quality and professional features. Features a large Aneroid gauge and durable inflation bulb.</p>",
			colors: "1STYLE",
			price: "79.99",
			weight: 1,
			sizes: "1SIZE"
		},
		"MOBB SCISSORS.jpeg" => {
			sku: "S150 SCISSORS150/190MM",
			description: "<p>MOBB SCISSORS<p><br><p>Available in assorted colors</p><br><p>150/190mm</p>",
			colors: "Blue,Red,Ceil,Black",
			price: "12.99",
			weight: 0.3,
			sizes: "150mm,190mm"
		},
		"MOBB SCRUB LOGO SHOULDER BAG.jpeg" => {
			sku: "MSLS-100",
			description: "<p>Made with MOBB scrub material and available in assorted colors and prints featuring the MOBB logo</p>",
			colors: "Brown,Green,White,Blue,Red",
			price: "4.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"MOBB LOGO RETRACTABLE ID CLIP.jpeg" => {
			sku: "MLRIC-100",
			description: "<p>Features the MOBB logo</p>",
			colors: "1STYLE",
			price: "2.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"MOBB LOGO TRAVEL COFFEE MUG.jpeg" => {
			sku: "MUG100",
			description: "<p>The perfect travel coffee mug for those busy days!</p>",
			colors: "1STYLE",
			price: "24.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"MOBB STETHOSCOPE ID NAME TAG.jpeg" => {
			sku: "STETHID-100",
			description: "<p>Mobb Stethoscopes ID Name Tag</p>",
			colors: "1STYLE",
			price: "9.99",
			weight: 0.1,
			sizes: "1SIZE"
		}
	}

	workvests = {
		"WORK WEAR SAFETY VEST.jpeg" => {
			sku: "WVEST",
			description: "<p>This durable vest provides the high visibility and utility that a busy surveyor will need to get the job done right. Fluorescent polyester makes you visible on site, while 9 pockets, a large back zip pocket, and a surveyor tape dispenser pocket allow you to carry a wide range of tools.</p>
						<br><br>
						<li>Fluorescent polyester fabric</li>
						<li>Fully compliant with CSA Z96-09 Class 2, Level 2</li>
						<li>Becomes CSA Class 3 in combination with appropriate model arm and leg bands</li>
						<li>Fully compliant with ANSI/ISEA 107-2004 Class 2, Level 2</li>
						<li>Reflective Material in 4' WCB/Worksafe/DOT configuration</li>
						<li>Safety D-ring slot access</li>
						<li>Survey tape dispenser grommets on lower front pockets</li>
						<li>Large pack zip pocket across entire back area</li>
						<li>8 pockets and 1 cell/radio phone sealed pouch</li>
						<li>Easy care, machine wash and dry</li>",
			colors: "Orange,Spruce",
			weight: 0.2,
			sizes: "M,L,XL,2XL,3XL"
		},
		"T VEST TRAFFIC VEST.JPEG" => {
			sku: "TVEST",
			description: "<li>100% Polyester Hi-Vis Traffic Vest</li>
			<li>5 point tear-away, Orange mesh with Hi-Vis reflective tape</li>
			<li>One chest pocket</li>
			<br><br>
			<li>One Size Fits ALL</li>",
			colors: "Orange",
			weight: 0.2,
			sizes: "1SIZE"
		}
	}

	workpants = {
		"CARGO WORK PANT.jpeg" => {
			sku: "PC500",
			description: "<p>These MOBB Cargo Work Pants are well constructed with 7.5 oz 65/35 Poly-Cotton. They have a heavy-duty brass zipper with top button closure, pleated cargo pockets with flap and velcro closure with 2 front pockets and 2 back pockets. These pants are comfortable and easy to wash. A great value for the working man</p>",
			colors: "NavyBlue",
			price: "29.99",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50,52,54"
		},
		"FLAT FRONT WORK PANT.jpeg" => {
			sku: "P400",
			price: "29.49",
			description: "<p>These MOBB Flat Front Work Pants  are a great choice for a busy day on the job. Made with 7.5 oz 65/35 poly-cotton they'll keep you comfortable all day long. They’re also easy to care for, just throw them into the machine when you get home for stress-free care. Features brass zipper and top button closure, 2 flat front slant pockets and 2 back pockets</p>",
			colors: "NavyBlue,Spruce",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60"
		},
		"WORK PANT WITH REFLECTIVE TAPE.jpeg" => {
			sku: "PS400",
			price: "34.49",
			description: "<p>High visibility MOBB Work Pant with Reflective Tape. Make sure you stay safe while being seen in these pants. 65/35 poly-cotton 7.5 oz pant with brass zipper and button top closure, 2 front slant pockets and 2 back pockets. Also available for women</p>",
			colors: "NavyBlue",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58"
		},
		"100 Percent Cotton Twill Work Pant.jpeg" => {
			sku: "P401",
			price: "28.99",
			description: "<p>Look smart and stylish in these classic fit, 100% Cotton Twill Work Pants. Made from breathable cotton, they offer all the comfort with a touch of casual style. Features brass zipper, button closure, 2 front slant pockets and 2 back pockets. Versatile and low-maintenance, these pants are ready for an active day</p>",
			colors: "NavyBlue",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50"
		},
		"LADIES FLAT FRONT WORK PANT.jpeg" => {
			sku: "P400L",
			price: "28.99",
			description: "<p>Made especially for ladies, these pants fit well and have a tough material that stands up to any abuse you put them through. Same durable construction as the P400 these 7.5oz 65/35 poly-cotton work pants feature a brass zipper with button closure, 2 flat front slant pockets and 2 back pockets</p>",
			colors: "NavyBlue,Spruce",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50,52"
		},
		"LADIES WORK PANT WITH REFLECTIVE TAPE.jpeg" => {
			sku: "PS400L",
			price: "34.49",
			description: "<p>Your safety comes first. Be seen in our Ladies Work Pant with Reflective Tape. With all the same features of the mens pant.7.5 oz 65/35 poly-cotton pant with brass zipper and top button closure, 2 front slant pockets and 2 back pockets</p>",
			colors: "NavyBlue",
			weight: 0.4,
			sizes: "28,30,32,34,36,38,40,42,44,46,48,50,52"
		}
	}

	workco = {
		"NOMEX IIIA FLAME RESISTANT COVERALL.jpeg" => {
			sku: "FR500",
			description: "<p>For hazards like firesand molten splashes, MOBB's Nomex® III A has you covered. A blend of 93% Nomex® with 5% Kevlar® and 2% antistatic fiber that expands to form a stable and inert barrier between fire and skin. Features 2-way Vislon Nomex® zipper, 2 snap clsoures at the neck, 1 snap waist closure, 2 upper and 2 lower patch pockets as well as 2 front slant pockets and 2 side access openings. Includes a tool pocket on the right leg, a pen pocket on the left arm and flame resistant velcro tabs on the sleeves and leg leg cuffs</p>",
			colors: "1STYLE",
			price: "189.49",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		},
		"INDURA ULTRA SOFT FLAME RESISTANT COVERALL.jpeg" => {
			sku: "FR100",
			price: "189.49",
			description: "<p>The ultra-soft feel of these coveralls offer enhanced comfort while keeping you protected from electric arc and flash fire exposures. Double-shrunk technology ensures they will fit you for years to come. Features 2-way Vislon Nomex® zippers, 2 snap closures at neck, 1 snap closure at waist, 2 upper and 2 lower back patch pockets and 2 front slant pockets as well as 2 side sccess openings. Includes a pen pocket on the left arm and a tool pocket on the right side, FR velcro tabs on sleeve and leg cuffs</p>",
			colors: "1STYLE",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		},
		"100 PERCENT COTTON TWILL COVERALL.jpeg" => {
			sku: "C200",
			price: "31.99",
			description: "<p>Up and down. Back and forth. In and out of the truck. These coveralls will go wherever you go. Heavy-duty 8.5oz. 100% cotton twill. Features a concealed metal button closure, 2 chest pockets, 2 lower back patch pockets and 2 lower front slant pockets as well as a pen and tool pocket</p>",
			colors: "1STYLE",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		},
		"CLASSIC POLY COTTON COVERALL.jpeg" => {
			sku: "C100",
			description: "<p>MOBB 65/35 Poly-Cotton blend zip-front coveralls have distinctive features of high durability, high tensile strength, good tear strength, colour fastness, pilling resistant, shrinkage control comfort wear and perfect fit. Features 2 top front pockets, 2 lower back patch pockets and 2 lower front slant pockets as well as a tool and pen pocket. Includes side access openings and action back</p>",
			colors: "1STYLE",
			price: "31.49",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		}, 
		"REFLECTIVE BANDED COVERALL.jpeg" => {
			sku: "C100R",
			description: "<p>Stay visible on the work site with these MOBB 7.5oz 65/35 poly-cotton blend coveralls featuring reflective tape banding.The premium reflective tape ensures you are visible to coworkers and drivers. Same features as the C100</p>",
			colors: "1STYLE",
			price: "54.99",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		}, 
		"CLASSIC BIB OVERALL.jpeg" => {
			sku: "B100",
			description: "<p>Strap on the MOBB Classic Bib Overall when there's rain, wind, and hard work in the forecast. Features adjustable suspenders, 2 chest pockets, 2 lower back patch pockets, 2 lower front slant pockets and a zipper closure</p>",
			colors: "1STYLE",
			price: "44.49",
			weight: 1,
			sizes: "S,M,L,XL,2XL,3XL"
		},
		"REFLECTIVE BIB OVERALL.jpeg" => {
			sku: "B100R",
			description: "<p>Stay visible and safe on the worksite with the MOBB Reflective Bib Coveralls featuring high visibility reflective tape banding for extra protection in low-light conditions. These pants will ensure you are comfortably protected while working in grimy conditions. Includes 2 lower back patch pockets, 2 lower front slant pockets and side access openings</p>",
			colors: "Orange,NavyBlue",
			price: "54.49",
			weight: 1,
			sizes: "S,M,L,XL,2XL,3XL"
		},
		"100 PERCENT COTTON TWILL COVERALL II.jpeg" => {
			sku: "C201 COVERALL",
			description: "<p>Up and down. Back and forth. In and out of the truck. These coveralls will go wherever you go. Heavy-duty 8.5oz. 100% cotton twill. Features a concealed metal button closure, 2 chest pockets, 2 lower back patch pockets and 2 lower front slant pockets as well as a pen and tool pocket</p>",
			colors: "PostmanBlue",
			price: "31.49",
			weight: 1,
			sizes: "38,40,42,44,46,48,50,52,54,56,58"
		}
	}

	chefcoats = {
		"ZIPPER CLOSURE CHEF COAT.jpeg" => {
			sku: "CC290",
			description: "<p>Fresh and new, zip up in MOBB kitchen fashion with our 7.5oz poly/cotton twill chef coat. Features a full zip closure, stand collar, thermo pocket on left sleeve, with vented cuff and underarms.</p>",
			colors: "Black,White",
			price: "32.99",
			weight: 0.6,
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			chart: "CC290-SC.png"
		},
		"CLASSIC CHEF COAT UNISEX.jpeg" => {
			sku: "CC250",
			description: "<p>MOBB kitchen classics. Professional and durable, our chef coats are made to last. Lightweight, breathable designs and a great selection of colors to choose from. 7.5oz poly cotton twill featuring a stand collar, vented cuff and underarms and a thermo pocket on left sleeve.</p>",
			colors: "Black,White,BlackWhite,WhiteHoundsTooth,RedBlack,BurgundyBlack",
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			price: "26.99",
			weight: 0.6,
			chart: "CC250-SC.png"
		},
		"CHEF COAT.jpeg" => {
			sku: "CC260",
			description: "<p>100% spun-poly 7.5oz. Stand collar, vented cuff, vented underarms, thermo pocket on left sleeve</p>",
			colors: "Black,White,BlackWhite",
			price: "26.99",
			weight: 0.6,
			sizes: "XS,S,M,L,XL,2XL,3XL"
		},
		"MANDARIN STYLE CHEF COAT.jpeg" => {
			sku: "CC270",
			description: "<p>MOBB kitchen classics. Professional and durable, our chef coats are made to last. Lightweight, breathable designs and a great selection of colors to choose from. 7.5oz poly cotton twill featuring a stand collar, vented cuff and underarms and a thermo pocket on left sleeve.</p>",
			colors: "BlackWhite,WhiteBlack",
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			price: "28.99",
			weight: 0.6,
			chart: "CC270-SC.png"
		}
	}

	chefpants = {
		"FLAT FRONT CHEF PANT.jpeg" => {
			sku: "34P",
			description: "<p>Combine a classic dress pant with the comfort of our MOBB chef pant and you get this flat-front chef pant. Featuring a plain waistband with belt loops and a full brass zipper fly with button closure. Tailored for a modern, professional look. 2 front slant pockets and 2 back patch pockets. 7.5oz poly/cotton</p>",
			colors: "HoundsTooth,Black,White",
			sizes: "28,30,32,34,36,38,40,42,44,46",
			price: "24.99",
			weight: 0.4,
			chart: "34P-SC.png"
		},
		"DRAWSTRING ELASTIC CHEF PANT.jpeg" => {
			sku: "307P",
			description: "<p>This chef pant is designed to be comfortable and functional while providing complete coverage when bending and reaching. 5oz poly/cotton blend pant featuring a combination drawstring/elastic waistband with 2 side pockets, 2 cargo pockets and 1 back pocket</p>",
			colors: "Black",
			price: "21.99",
			weight: 0.4,
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			chart: "307P-SC.png"
		},
		"WOVEN CHEF PANT.jpeg" => {
			sku: "303P",
			description: "<p>The MOBB Woven Chef Pant features a relaxed fit with ample room in the hip and thighs and a slightly tapered ankle. The 1” elastic waistband with built in elastisized drawstring falls just above your natural waistline and provides comfort and security for all body types.</p>",
			colors: "HoundsTooth",
			price: "21.99",
			weight: 0.4,
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL"
		},
		"UNISEX BAGGY CHEF PANT.jpeg" => {
			sku: "301P",
			description: "<p>The MOBB Baggy Chef Pant is the ultimate in culinary coolness. With its unisex, elastic waist style our chef pants continue to be the choice for chefs today. Features a 2” elastisized drawstring waistband for maximum coverage and comfort. A slightly tapered ankle keeps the pants from dragging on the floor. 2 front slant pockets and 1 back patch pocket</p>",
			colors: "MrBOB,HoundsTooth,Gangster,Black",
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			price: "28.99",
			weight: 0.4,
			chart: "301P-SC.png"
		}
	}

	cheftops = {
		"BUTTON DOWN PROFESSIONAL KITCHEN TOP.jpeg" => {
			sku: "204T",
			description: "<p>The MOBB Button Down Professional Kitchen features short-sleeves, one breast patch pocket and a pointed collar to round out the look. The lightweight 5oz. 65/35 poly/cotton poplin is wrinkle-resistant</p>",
			colors: "White",
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			price: "12.99",
			weight: 0.3,
			chart: "204T-SC.png"
		},
		"MANDARIN COLLAR PROFESSIONAL KITCHEN TOP.jpeg" => {
			sku: "205T",
			description: "<p>The MOBB Mandarin Collar Professional Kitchen Top offers a clean, polished look. Featuring a mid-weight cotton twill keeping you cool and comfortable, 1 left chest pocket and snap button closure</p>",
			colors: "White",
			sizes: "XS,S,M,L,XL,2XL,3XL,4XL",
			price: "12.99",
			weight: 0.3,
			chart: "205T-SC.png"
		},
		"LONG SLEEVE PROFESSIONAL KITCHEN TOP.jpeg" => {
			sku: "S302",
			description: "<p>The MOBB Long Sleeve Professional Kitchen Top offers classic no pocket styling. This durable yet lightweight 5oz. poly-cotton poplin blend retains its crisp professional look even after multiple uses. Featuring a snap front closure with a roomy, yet flattering fit</p>",
			colors: "White",
			price: "24.99",
			weight: 0.3,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		},
		"SHORT SLEEVE PROFESSIONAL KITCHEN TOP.jpeg" => {
			sku: "S303",
			description: "<p>The MOBB Short Sleeve Professional Kitchen Top offers classic no pocket styling. This durable yet lightweight 5oz. poly-cotton poplin blend retains its crisp professional look even after multiple uses. Featuring a snap front closure with a roomy, yet flattering fit</p>",
			colors: "White",
			price: "24.99",
			weight: 0.3,
			sizes: "S,M,L,XL,2XL,3XL,4XL"
		}
	}

	chefhats = {
		"TRADITIONAL CHEF HAT.jpeg" => {
			sku: "CF451",
			description: "<p>The MOBB Traditional Chef Hat is a symbol of authority and knowledge. It is made with soft, comfortable 65/35 poly-cotton. Its wide band and generous pleats make it a stand out headwear option. Adjustable velcro closure in the back offers a fully adjustable one size fit</p>",
			colors: "White,Black",
			price: "9.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"PILLBOX CHEF HAT.jpeg" => {
			sku: "CF460",
			description: "<p>The clean, modern look of the MOBB Chef Hat has boosted it to the top of the best seller list. This version features a solid top pillbox style. Adjustable velcro sizing provides a perfect one size fit</p>",
			colors: "Black,Red",
			price: "8.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"MESH TOP CHEF HAT.jpeg" => {
			sku: "CF460M",
			description: "<p>The clean, modern look of the MOBB Mesh Top Chef Hat has boosted it to the top of the best seller list. This version features a mesh top pillbox style. Adjustable velcro sizing provides a perfect one size fit</p>",
			colors: "Black,Red",
			price: "8.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"CHEF HAT.jpeg" => {
			sku: "CF450",
			description: "<p>The clean, modern look of the MOBB Chef Hat has boosted it to the top of the best seller list. This version features a solid top pillbox style. Adjustable velcro sizing provides a perfect one size fit</p>",
			colors: "Black,White",
			price: "8.99",
			weight: 0.1,
			sizes: "1SIZE"
		},
		"NECKERCHIEF.jpeg" => {
			sku: "N100",
			description: "<p>The MOBB Neckerchief helps keep the sweat off of chefs' necks while in the kitchen, in turn keeping them cooler</p>",
			colors: "Black,White",
			price: "7.99",
			weight: 0.1,
			sizes: "1SIZE"
		}
	}

	wvest = {
		"WAITER OR WAITRESS VEST.jpeg" => {
			sku: "VE340",
			description: "<p>100% polyester vest, black satin lined with button front closure. The Waiter/Waitress is manageable and easy to care for while always looking professional and sharp for all front of house positions</p>",
			colors: "Black",
			price: "19.99",
			weight: 0.3,
			sizes: "30,32,34,36,38,40,42,44,46,48,50,52,54,56,58"
		}
	}

	aprons = {
		"BISTRO APRON.jpeg" => {
			sku: "AP390",
			description: "<p>The MOBB Bistro apron is made with durable polyester/cotton twill for stain and wrinkle resistance.
										This apron has 3 pockets and falls just below the knees making it the perfect fit for front or back of the house.</p>",
			colors: "Bob,Gangster",
			price: "24.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"GANGSTER STRIPE V NECK APRON.jpeg" => {
			sku: "AP389",
			description: "<p>The MOBB Three-Pocket v-neck apron is made with durable polyester/cotton twill for stain and wrinkle resistance. This apron falls above the knees and has an adjustable velcro neck closure.</p>",
			colors: "Gangster",
			price: "16.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"3 POCKET BLACK WAIST APRON.jpeg" => {
			sku: "AP381",
			description: "<p>The MOBB Waist Apron is made with durable polyester/cotton twill for stain and wrinkle resistance. It features 3 pockets for all of your front of the house tools. Perfect for servers.</p>",
			colors: "Black",
			price: "6.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"WAIST APRON NO POCKETS.jpeg" => {
			sku: "AP387",
			description: "<p>The MOBB basic apron is made with durable polyester/cotton twill for stain and wrinkle resistance. It features a plain front with no pockets</p>",
			colors: "Black,White",
			price: "6.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"4 WAY CHEF APRON.jpeg" => {
			sku: "AP388",
			description: "<p>The MOBB 4-Way Chef Apron is the ultimate in utility. This amazing cooking apron offers a fresh start four times with its front-to-back and inside-to-out reversibility. The ties are securely tacked for comfort and durability. No pockets</p>",
			colors: "Black,White",
			price: "9.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"COIN APRON.jpeg" => {
			sku: "AP394",
			description: "<p>The MOBB Coin apron is made with durable polyester/cotton twill for stain and wrinkle resistance. It features 4 large pockets, 2 pen slots and an adjustable plastic buckle on the waistbandand</p>",
			colors: "Black",
			price: "14.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"BIB APRON.jpeg" => {
			sku: "AP385",
			description: "<p>The MOBB Bib Apron is made to look and feel good, while still holding up to the rigors of the kitchen. 
This cooking apron is generously cut for full coverage on the both bib and bottom and features 2 pockets and adjustable neck.</p>",
			colors: "Black,Burgundy,NavyBlue,Red,RoyalBlue,Spruce",
			sizes: "1SIZE",
			price: "11.99",
			weight: 0.3,
			chart: "AP385-SC.png"
		},
		"FULL LENGTH APRON.jpeg" => {
			sku: "AP380",
			description: "<p>The MOBB Full-Length Apron features extra wide ties and adjustable neck loop designed for all day comfort. Its 7.5 oz 65/35 polyester/cotton is soft and breathable, but stills repels stains and wrinkles</p>",
			colors: "Black,White",
			sizes: "1SIZE",
			price: "8.99",
			weight: 0.3,
			chart: "AP380-SC.png"
		},
		"LONG WAIST BISTRO APRON.jpeg" => {
			sku: "AP383",
			description: "<p>The MOBB Long-Waist Bistro apron is made with durable polyester/cotton twill for stain and wrinkle resistance. This apron falls just below the knees and has 2 pockets, making it the perfect for the front or the back of the house</p>",
			colors: "Black,White",
			sizes: "1SIZE",
			price: "7.99",
			weight: 0.3,
			chart: "AP383-SC.png"
		},
		"COBBLER APRON.jpeg" => {
			sku: "AP382",
			description: "<p>The MOBB Cobbler Apron is durable, affordable, and totally professional looking. In addition to outfitting waitstaff and kitchen staff, a cobbler apron is also ideal for housekeeping, maintenance, and stadium personnel</p>",
			colors: "Black,Burgundy,NavyBlue,Red,RoyalBlue,Spruce",
			sizes: "1SIZE",
			price: "9.99",
			weight: 0.3,
			chart: "AP383-SC.png"
		}
	}

	stethoscopes = {
		"LITTMANN CLASSIC II STETHOSCOPE.jpeg" => {
			sku: "2201",
			description: "<li>Shift from light to firm pressure and switch easily from low to high frequency sounds with 3M’s ‘Tunable Technology’.</li>
										<li>Have the option of using the tunable diaphragm on the front or the traditional bell on the reverse of the double-sided chestpiece.</li>
										<li>Experience reduced ambient noise from the acoustic seal created by comfortable Snap-Tight soft seal eartips.</li>
										<li>Robust headset and latex free tubing that is durable enough to withstand one million flexes.</li>
										<li>Littmann’s large range of chestpiece finishes and tubing colours allows you to express your own personal style.</li>
										<li>Diagnostic aid used in the physical assessments of patients.</li>
										<li>Free repair on any manufacturing or material defects is included in the 3 year warranty.</li>
										<li>7 out of 10 Littmann performance rating</li>
										<li>Color tubing (28”/71cm)</li>
										<li>Stainless Steel Finishing</li>
										<li>Brand name : Littmann Stethoscope</li>
										<li>Users can use : General Practitioners, Medical Students, Nurses</li>",
		price: "109.49",
		weight: 0.3,
		colors: "Black,Burgundy,Caribbean,Ceil,Grey,Green,NavyBlue,Orange,Pink,Purple,Raspberry,OceanBlue,RoyalBlue",
		sizes: "1SIZE"
		},
		"LITTMANN LIGHTWEIGHT II STETHOSCOPE.jpeg" => {
			sku: "2450",
			description: "<li>The uniquely shaped chestpiece allows easy navigation around blood pressure cuffs and critical body contours.</li>
										<li>Switch easily from low to high frequency sounds with 3M’s ‘Tunable Technology' by switching from light to firm pressure</li>
										<li>Choose between a tunable diaphragm or a traditional bell thanks to a double-sided chestpiece.</li>
										<li>Comfortably positioned headset is anatomically designed for optimal sound transmission.</li>
										<li>Snap-Tight soft seal eartips form an excellent acoustic seal, reducing ambient noise.</li>
										<li>Key diagnostic aid in the process of physical patient assessments.</li>
										<li>Included in 2 year warranty.</li>
										<li>6 out of 10 Littmann performance rating.</li>
										<li>Color tubing (28”/71cm)</li>
										<li>Stainless Steel Finishing</li>
										<li>Brand name : Littmann Stethoscope</li>
										<li>Physical Assessment, Diagnosis</li>
						 	      <li>Users can use : General Practitioners, Medical Students, Nurses</li>",
		colors: "Black,Burgundy,Caribbean,Ceil,Lilac,Green",
		price: "119.49",
		weight: 0.3,
		sizes: "1SIZE"
		},
		"LITTMANN CLASSIC III PEDIATRIC STETHOSCOPE.jpeg" => {
			sku: "2113",
			description: "<li>Miniature chestpiece uniquely designed for paediatric/petite patients and hard to reach areas.</li>
										<li>Have the option of a 3.3cm standard diaphragm or a 2.5cm traditional open bell thanks to the double-sided chestpiece.</li>
										<li>Improve patient comfort with a rubber non-chill rim and diaphragm.</li>
										<li>Experience optimal sound transmission from the comfortably positioned, anatomically designed headset.</li>
										<li>Comfortable Snap-Tight soft seal eartips reduce ambient noise.</li>
										<li>Latex free tubing and durable headset reliably withstands one million flexes.</li>
										<li>Choose from Littmann’s wide range of bright tubing colours and finishes to compliment your personal style.</li>
										<li>Used as a key diagnostic aid during the physical assessments of young patients.</li>
										<li>Free repair on any manufacturing or material defects included in the 3 year warranty.</li>
										<li>7 out of 10 Littmann performance rating.</li>
										<li>Colored tubing (28”/71cm) Stainless Steel finish.</li>
										<li>Stainless Steel Finishing</li>
										<li>Physical Assessment, Diagnosis</li>
										<li>Users can use : General Practitioners, Child Specialists</li>
										<li>Littmann Classic III Pediatric Stethoscope</li>",
			colors: "Black,Caribbean,NavyBlue,Raspberry",
			price: "139.49",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"LITTMANN INFANT STETHOSCOPE.jpeg" => {
			sku: "2114",
			description: "<li>Uniquely designed miniature chestpiece for neonatal/infant patients.</li>
										<li>Double-sided chestpiece gives you the option of a 2.7cm standard diaphragm on the front or a 1.9cm traditional open bell on the reverse.</li>
										<li>Rubber non-chill rim and diaphragm for patient comfort.</li>
										<li>Anatomically designed headset comfortably positioned for optimal sound transmission.</li>
										<li>Comfortable Snap-Tight soft seal eartips create an excellent acoustic seal to reduce ambient noise.</li>
										<li>Durable latex free tubing and a robust headset that can be reliably flexed one million times.</li>
										<li>Complement your personal style with Littmann’s wide range of bright tubing colours and finishes.</li>
										<li>Used as a diagnostic aid as part of the physical assessment of an infant patient.</li>
										<li>3 year warranty includes free repair on any manufacturing or material defects.</li>
										<li>Littmann performance rating of 7 out of 10.</li>
										<li>Tubing: Based on color choice (71cm/28).</li>
										<li>Stainless Steel Finishing</li>
										<li>Physical Assessment, Diagnosis</li>
										<li>Users can use : General Practitioners, Child Specialists</li>
										<li>Littmann Infant Stethoscope</li>",
			colors: "Black,Caribbean,Raspberry",
			price: "129.49",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"LITTMANN CARDIOLOGY III STETHOSCOPE.jpeg" => {
			sku: "3129",
			description: "<li>Apply light to firm pressure, and switch easily between low and high frequency sounds with 3M’s ‘Tunable Technology’.</li>
										<li>Assess both adult and paediatric patients with the double-sided large/small chestpiece.</li>
										<li>Reverse side transforms easily into a traditional open bell with the supplied adapter for maximum versatility.</li>
										<li>The superior transmission and insulation of sound from the double lumen tubing (two tubes in one) also eliminates “rubbing noise”.</li>
										<li>Optimal sound transmission from the comfortably positioned, anatomically designed headset.</li>
										<li>Reliably flex the durable latex free tubing up to one million times.</li>
										<li>Use Littmann’s large range of chestpiece finishes and tubing colours to compliment your personal style.</li>
										<li>Used as a key diagnostic aid during the physical assessment of a patient.</li>
										<li>Free repair on any manufacturing or material defects included in the 3 year warranty.</li>
										<li>9 out of 10 Littmann performance rating.</li>
										<li>Colored Tubing (27”/68.5cm)</li>
										<li>Brand: Littmann Cardiology III Stethoscope</li>
										<li>User Group: Cardiologists, Child Specialists, General Practitioners, Medical Students, Respiratory Specialist, Critical Care Nurse</li>",
			colors: "Burgundy,Plum,Caribbean,NavyBlue,Red,Raspberry,Black",
			price: "163.49",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"LITTMANN MASTER CARDIOLOGY STETHOSCOPE.jpeg" => {
			sku: "2160",
			description: "<li>Switch easily between low and high frequencies with 3M’s ‘Tunable Technology’ by shifting from light to firm pressure.</li>
										<li>The single-sided ,solid stainless steel chestpiece is handcrafted and of the highest quality.</li>
										<li>Includes special procedures adaptor for pediatric, neonatal or difficult to reach auscultation.</li>
										<li>Double lumen tubing (two tubes in one) eliminates “rubbing noise” and allows for superior transmission and insulation of sound.</li>
										<li>The excellent acoustic seal formed by comfortable Snap-Tight soft seal eartips reduces ambient noise.</li>
										<li>Express your personal style by choosing from Littmann’s large range of chestpiece finishes and tubing colours.</li>
										<li>Used as a diagnostic aid during thing physical assessments of heart, lung and bowel sounds.</li>
										<li>Free repair on any manufacturing or material defects included in the 7 year warranty.</li>
										<li>10 out of 10 Littmann performance rating.</li>
										<li>Black tubing (27”/68.5cm)</li>
										<li>Polished Stainless Steel, Single-sided</li>
										<li>Brand: Littmann Master Cardiology Stethoscope</li>
										<li>User Group: Cardiologists, General Practitioners, Medical Students, Respiratory Specialist, ER, Critical Care Nurse, EMTs, Critical Care Nurse</li>",
			colors: "Black",
			price: "259.99",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"LITTMANN MASTER CLASSIC STETHOSCOPE.jpeg" => {
			sku: "2144L",
			description: "<li>3M’s ‘Tunable Technology’ lets you easily switch from low to high frequency sounds by switching from light to firm pressure.</li>
										<li>Award-winning ergonomically designed chestpiece allows a comfortable grip for extended use.</li>
										<li>Anatomically designed headset comfortably positioned for optimal sound transmission.</li>
										<li>Comfortable Snap-Tight soft seal eartips create an excellent acoustic seal to reduce ambient noise.</li>
										<li>Durable latex free tubing can be reliably flexed one million times.</li>
										<li>Complement your personal style with a range of chestpiece finishes and tubing colours.</li>
										<li>Used as a diagnostic aid as part of the physical assessment of cardiac, adult and paediatric patients.</li>
										<li>3 year warranty includes free repair on any manufacturing or material defects.</li>
										<li>Littmann performance rating of 8 out of 10.</li>
										<li>Tubing: Colored (65.5cm/27). Finish: Polished Steel</li>
										<li>Chestpiece: Plated & Polished Alloy, Single-Sided</li>
										<li>USer Group : GPs, Nurses</li>",
		  colors: "Black",
		  price: "89.49",
		  weight: 0.3,
		  sizes: "1SIZE"
		},
		"LITTMANN CLASSIC II SE28.jpeg" => {
			sku: "2829RBW",
			description: "<li>3M’s ‘Tunable Technology’ lets you easily switch from low to high frequency sounds by switching from light to firm pressure.</li>
										<li>Double-sided chestpiece gives you the option of a tunable diaphragm on the front or a traditional bell on the reverse.</li>
										<li>Anatomically designed headset comfortably positioned for optimal sound transmission.</li>
										<li>Comfortable Snap-Tight soft seal eartips create an excellent acoustic seal to reduce ambient noise.</li>
										<li>Durable latex free tubing and a robust headset which can be reliably flexed one million times.</li>
										<li>Complement your personal style with Littmann’s largest range of chestpiece finishes and tubing colours.</li>
										<li>Used as a diagnostic aid as part of the physical assessment of a patient.</li>
										<li>3 year warranty includes free repair on any manufacturing or material defects.</li>
										<li>Littmann performance rating of 7 out of 10.</li>
										<li>Tubing: Colored (71cm/28'). Finish: Rainbow. Brass finish headset.</li>
										<li>Chestpiece: Machined Stainless Steel, Two-sided</li>
										<li>User Group : GPs, Medical Students, Nurses</li>",
			colors: "Raspberry,Rose,Caribbean,Black,Brown,Green,Yellow",
			price: "89.49",
			weight: 0.3,
			sizes: "1SIZE"
		},
		"MOBB KT107 BLACK.jpeg" => {
			sku: "KT107",
			description: "<li>Experience reduced ambient noise from the acoustic seal created by comfortable Snap-Tight soft seal eartips.</li>
										<li>Robust headset and latex free tubing that is durable enough to withstand one million flexes.</li>
										<li>Diagnostic aid used in the physical assessments of patients.</li>
										<li>3 year warranty includes free repair on any manufacturing or material defects.</li>
										<li>Tubing: Black  (71cm/28').</li>
										<li>Finish: Stainless Steel Finishing</li>
										<li>Brand name : MOBB MEDICAL</li>
										<li>Users can use : General Practitioners, Medical Students, Nurses</li>",
			colors: "Black",
			price: "39.49",
			weight: 0.3,
			sizes: "1SIZE"
		}
	}

	clearance = {
		"Clearance Petite Unisex 8 Pocket Drawstring Elastic Scrub Set.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>
										",
			colors: "Lagoon,Lilac,NavyBlue,RoyalBlue,White",
			price: "33.95",
			weight: 0.7,
			sizes: "XXS,XS,S,M,L,XL,2XL,3XL,4XL"
		},
		"Criss Cross Flip Flap Aqua.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Aqua",
			price: "27.95",
			weight: 0.7,
			sizes: "2XL"
		},
		"Criss Cross Flip Flap Black With Dusty Rose Trim.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "BlackDustyRose",
			price: "27.95",
			weight: 0.7,
			sizes: "2XL"
		},
		"Criss Cross Flip Flap Black and Aqua.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "BlackAqua",
			price: "27.95",
			weight: 0.7,
			sizes: "2XL"
		},
		"Criss Cross Flip Flap Brown.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Brown",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,XS,L,XL,2XL"
		},
		"Criss Cross Flip Flap Bubble Gum.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "BubbleGum",
			price: "27.95",
			weight: 0.7,
			sizes: "S,M,L,XL,2XL"
		},
		"Criss Cross Flip Flap Dusty Rose.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "DustyRose",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,L,XL,2XL"
		},
		"Criss Cross Flip Flap Dusty Rose With Polka Dots.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "DustyRosePolkaDots",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,L,XL,2XL"
		},
		"Criss Cross Flip Flap Khaki.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Khaki",
			price: "27.95",
			weight: 0.7,
			sizes: "L,XL,2XL"
		},
		"Criss Cross Flip Flap Lime Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "LimeGreen",
			price: "27.95",
			weight: 0.7,
			sizes: "L,XL,2XL"
		},
		"Criss Cross Flip Flap Nutmeg.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Khaki",
			price: "27.95",
			weight: 0.7,
			sizes: "S,XL,2XL"
		},
		"Criss Cross Flip Flap Olive Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "OliveGreen",
			price: "27.95",
			weight: 0.7,
			sizes: "L,XL,2XL"
		},
		"Criss Cross Flip Flap Pink.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Pink",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,XS,M,L,XL,2XL"
		},
		"Criss Cross Flip Flap Postman Blue.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "PostmanBlue",
			price: "27.95",
			weight: 0.7,
			sizes: "2XL"
		},
		"Criss Cross Flip Flap Red.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Red",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,L,XL,2XL"
		},
		"Criss Cross Flip Flap Sea Green.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "SeaGreen",
			price: "27.95",
			weight: 0.7,
			sizes: "L"
		},
		"Criss Cross Flip Flap Sky Blue.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "SkyBlue",
			price: "27.95",
			weight: 0.7,
			sizes: "XL,2XL"
		},
		"Criss Cross Flip Flap Tangerine.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "Tangerine",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,L,XL,2XL"
		},
		"Criss Cross Flip Flap White.jpeg" => {
			sku: "323/312C",
			description: "<p>The Criss Cross Flip Flap scrub set is what happens when we combine two scrub favorites to make a set. The v-neck scrub top with contrast color trim has two lower pockets and one shoulder pen pocket. The pant is our classic boot cut pant with signature MOBB logo waistband that can be flipped down for a lower rise.</p>",
			colors: "White",
			price: "27.95",
			weight: 0.7,
			sizes: "XL,2XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Brick.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "Brick",
			price: "32.95",
			weight: 0.7,
			sizes: "XXS,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Brown.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "Brown",
			price: "27.95",
			weight: 0.7,
			sizes: "XXS,XS,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Dusty Rose.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "DustyRose",
			price: "32.95",
			weight: 0.7,
			sizes: "XS,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Lilac.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "Lilac",
			price: "32.95",
			weight: 0.7,
			sizes: "XXS,XS,M,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Lime Green.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "LimeGreen",
			price: "32.95",
			weight: 0.7,
			sizes: "XS,M,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Pink.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "Pink",
			price: "32.95",
			weight: 0.7,
			sizes: "XXS,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Red.jpeg" => {
			sku: "308/312C",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			price: "32.95",
			colors: "Red",
			weight: 0.7,
			sizes: "XS,S,L,XL"
		},
		"V Neck 3 Pocket Dolman Seeve Flip Fap Scrub Set Tangerine.jpeg" => {
			sku: "308/312C",
			price: "32.95",
			description: "<p>Bright, Bold and Basic. 3 pocket v-neck scrub top with dolman sleeves paired with our 5 pocket bootcut scrub pant featuring our signature MOBB logo waistband that can be flipped for a lower rise.</p>",
			colors: "Tangerine",
			weight: 0.7,
			sizes: "XXS,XS,L,XL"
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Burgundy.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: "Burgundy",
			price: "33.95",
			weight: 0.7,
			sizes: "L,XL,2XL,3XL,4XL"
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Caribbean.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: "Caribbean",
			price: "33.95",
			weight: 0.7,
			sizes: "S,L,2XL,3XL,4XL"
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Ceil.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: "Ceil",
			price: "33.95",
			weight: 0.7,
			sizes: "XXS,XS,L,XL,2XL,3XL,4XL"
		},
		"Petite Unisex 8 Pocket Drawstring Elastic Scrub Set Khaki.jpeg" => {
			sku: "P310/307C",
			description: "<p>Amazing fit in select MOBB colors. Unisex v-neck scrub top with 3 front pockets and one shoulder pen pocket and a 5 pocket scrub pant with a combination drawstring and elastic waist for maximum comfort.<p>",
			colors: "Khaki",
			price: "33.95",
			weight: 0.7,
			sizes: "XXS,XS,S,M,L,2XL,3XL,4XL"
		}
	}

	default_params = { 
		:short_description => 'Not Applicable but must validate',  
		:tax_rate => tax_rate
	}

	file_paths.each do |fp|

		filename = File.basename(fp)
		name = File.basename(filename, File.extname(filename))
		# fp.split("/").last.gsub(".jpeg,").titleize

		if params = tops[filename]

				# pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], tax_rate: tax_rate, cost_price: params[:price].to_i, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat1
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = sets[filename] 
				
				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat2
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro
		

		elsif params = clearance[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat22
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = stethoscopes[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat7
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = workcoats[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat15
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = workco[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat16
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = fireretardent[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat14
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = workshirts[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat18
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = workvests[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat19
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = wvest[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat13
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = caps[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat5
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = accessories[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat6
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = workpants[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat17
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = pants[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat3
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = aprons[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat12
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = chefpants[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat10
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = chefcoats[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat8
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = cheftops[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat11
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = chefhats[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat9
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = mentalityh[filename] 

				pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat20
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro

		elsif params = mentalitysf[filename] 

		pro = Shoppe::Product.new(default_params.merge(description: params[:description], cost_price: params[:price].to_i, tax_rate: tax_rate, price: params[:price].to_i, colors: params[:colors], sizes: params[:sizes], sku: params[:sku], weight: params[:weight], name: name))
				pro.product_category = cat21
				pro.default_image_file = get_file(filename)
				pro.save!
				pro.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 1000)

				if params[:chart]
					stylename = File.basename(params[:chart])
					pro.data_sheet_file = get_style(stylename)
					pro.save! 
				end

				p pro
		 	
		end
  end
end

def country
	Shoppe::Country.destroy_all
	Shoppe::Country.create(name: "Canada", code2: 'CA', code3: 'CAN', continent: 'NA', tld: 'ca')
	Shoppe::Country.create(name: "United States", code2: 'US', code3: 'USA', continent: 'NA', tld: 'us')
end

seed_shit
country