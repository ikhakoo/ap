namespace :session_tasks do
  desc "TODO"
  task delete_empty_orders: :environment do
  	bad_orders = Shoppe::Order.where("first_name is null")
		good_orders = Shoppe::Order.where("first_name is not null")
		total = bad_orders.count + good_orders.count
		
		puts "Total: #{total}"
		puts "Good: #{good_orders.count}"
		puts "Bad: #{bad_orders.count}"

  	bad_orders = Shoppe::Order.where("first_name is null").where("last_name is null")
  	bad_orders.destroy_all

  	bad_orders = Shoppe::Order.where("first_name is null")
		good_orders = Shoppe::Order.where("first_name is not null")
		total = bad_orders.count + good_orders.count
		
		puts "Total: #{total}"
		puts "Good: #{good_orders.count}"
		puts "Bad: #{bad_orders.count}"
  end
end
