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
			sizes: ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
		 }#,
		# "The Pearl" => {
		# 	sku: "T3020",
		#   colors: ["Black", "Royal Blue", "Charcoal", "White"]
		# },
		# "Basic V Neck Scrub Top" => {
		# 	sku: "606T",
		# 	colors: ["Black", "Cappuccino", "Ceil", "Lagoon", "Postman Blue", "Sky Blue", "Burgundy", "Caribbean", "Charcoal", "Navy Blue", "Royal Blue", "White"]
		# },
		# "Zipper Front Ladies Work Top" => {
		# 	sku: "202T",
		# 	colors: ["Black", "White", "Navy Blue"]
		# },
		# "T Flexi V Neck Scrub Top" => {
		# 	sku: "",
		# 	colors: ["2tone White/White", "Black", "Brown", "Charcoal", "Deja Vu", "Eggplant", "Heart Ties", "Khaki",
		# 					 "Lime Green", "Olive Green", "Papillon", "Postman Blue", "Raspberry", "Royal Blue", "String Along",
		# 					 "Zen Stem", "Aqua", "Blue Cheerios", "Cappuccino", "Deep Orchid", "Dusty Rose", "Fire Works", "Indigo",
		# 					 "Lagoon", "Navy Blue", "Paisley Pink", "Pink Sorbet", "Pretty in Petals", "Red", "Sea Green",
		# 					 "Techno"]
		# },
		
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
			pro = Shoppe::Product.new(default_params.merge(sku: params[:sku] + "-#{color}", name: "#{name}-#{color}"))
			pro.product_category = cat1
			pro.default_image_file = get_file(filename)
			pro.save!
			pro.product_attributes.create!(:key => 'Color', :value => color, :position => 1)

			p pro

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
			print params[:sku] 
		end
	end
  end
end

seed_shit