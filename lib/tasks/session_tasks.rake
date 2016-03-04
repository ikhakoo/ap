namespace :session_tasks do
  desc "TODO"
  task delete_empty_orders: :environment do
  	@orders = Shoppe::Order.all
    @bad_orders = []
    @orders.each do |o|
      if !o.first_name.present?
        @bad_orders << o
      end
    end
    @bad_orders.destroy_all!
  end
end
