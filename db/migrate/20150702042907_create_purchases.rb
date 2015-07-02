class CreatePurchases < ActiveRecord::Migration
  def change
    create_table :purchases do |t|
      t.integer :order_id
      t.integer :client_id

      t.timestamps null: false
    end
  end
end
