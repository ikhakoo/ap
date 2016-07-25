namespace :session_tasks do
  desc "TODO"
  task delete_empty_orders: :environment do
    puts "==========================="
    puts "| Deleting the empty orders"
    2.times do
      puts "|"
    end
  	orders = Shoppe::Order.all
    bad_orders = []
    orders.each do |o|
      if !o.first_name.present?
        bad_orders << o
      end
    end
    puts "| #{bad_orders.count}"
    puts "| Destroying bad orders"
    bad_orders.each(&:destroy)
    puts "| Complete"
    puts "==========================="
    UserMailer.bad_orders_deleted
  end
end
