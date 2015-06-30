# ap


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