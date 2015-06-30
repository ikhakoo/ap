# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


# encoding: UTF-8

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




	file_paths = Dir.glob("db/seeds_data/*.jpeg")

	file_paths.each do |fp|

		name = fp.split("/").last.gsub(".jpeg", "").titleize

		if name == 'The Rosey'
			sku = 'T3030'
			colors = ["Black", "Royal Blue", "Charcoal", "White"]
		elsif name = 'The Pearl'
			colors = ["Black", "Royal Blue", "Charcoal", "White"]
			sku = 'T3020'
		elsif name = 'Basic V-Neck Scrub Top'
			colors = ["Black", "Cappuccino", "Ceil", "Lagoon", "Postman Blue", "Sky Blue", "Burgundy", "Caribbean", "Charcoal", "Navy Blue", "Royal Blue", "White"]
			sku = '606T'

		elsif name = "Zipper Front Ladies Work Top"
			colors = []
			sku = ''
		elsif name = "Flexi V Neck Scrub Top"
			colors = []
			sku = ''
		elsif name = "Ultra Flexi Scrub Top"
			colors = []
			sku = ''
		elsif name = "3 Pocket V Neck Scrub Top"
			colors = []
			sku = ''
		elsif name = "Unisex V Neck Scrub Top"
			colors = []
			sku = ''
		elsif name = "Ladies Sculpted Scrub Top"
			colors = []
			sku = ''
		elsif name = "Active Flexi V Neck Scrub Top"
			colors = []
			sku = ''
		elsif name = "Men’s Two Tone Scrub Top"
			colors = []
			sku = ''
		elsif name = "Empire Tie Back Scrub Top"
			colors = []
			sku = ''
		elsif name = "The Coco"
			colors = []
			sku = ''
		elsif name = "The Mandy"
			colors = []
			sku = ''
		elsif name = "The Roxy"
			colors = []
			sku = ''
		elsif name = "Ladies Zipper Detail Scrub Top"
			colors = []
			sku = ''
		elsif name = "V Neck Print Scrub Top"
			colors = []
			sku = ''
		elsif name = "Criss Cross Scrub Top"
			colors = []
			sku = ''
		elsif name = "Button Front Ladies Work Top"
			colors = []
			sku = ''
		elsif name = "Ladies Long Sleeve Tee"
			colors = []
			sku = ''
		end

		pro = Shoppe::Product.new(:name => name, :sku => sku, :description => 'test', :short_description => 'test', :weight => 1.119, :price => 24.99, :cost_price => 8.99, :tax_rate => tax_rate)
		pro.product_category_id = cat1.id
		pro.default_image_file = get_file(name + '.jpeg')
		pro.save!
		pro.product_attributes.create!(:key => 'Color', :value => 'Black', :position => 1)

		colors.each do |color|
			color_sku = sku + "-" + color

			v = pro.variants.create(:name => name + color, :sku => color_sku, :price => pro.price, :cost_price => pro.cost_price, :tax_rate => tax_rate, :weight => pro.weight, :default => true)
			v.default_image_file = get_file(name + ".jpeg")
			v.save!
			v.stock_level_adjustments.create(:description => 'Initial Stock', :adjustment => 10)
		end
		
		sku = sku + 1

  end

  print sku 

end

def get_file(name, content_type = 'image/jpeg')
  file = ActionDispatch::Http::UploadedFile.new(:tempfile => File.open(File.join(Rails.root, 'db', 'seeds_data', name), 'rb'))
  file.original_filename = name
  file.content_type = content_type
  file
end

seed_shit
