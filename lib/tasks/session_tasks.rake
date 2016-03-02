namespace :session_tasks do
  desc "TODO"
  task delete_empty_orders: :environment do
  	bad_orders = Shoppe::Orders.where("first_name is null").where("last_name is null")
  	bad_orders.destroy
  end
end
