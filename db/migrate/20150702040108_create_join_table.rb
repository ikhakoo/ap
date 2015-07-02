class CreateJoinTable < ActiveRecord::Migration
  def change
    create_join_table :clients, :shoppe_orders do |t|
      t.index [:client_id, :shoppe_order_id]
      t.index [:shoppe_order_id, :client_id]
    end
  end
end
