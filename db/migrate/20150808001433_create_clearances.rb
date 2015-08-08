class CreateClearances < ActiveRecord::Migration
  def change
    create_table :clearances do |t|
      t.integer :product_id
      t.text :color
      t.text :available_size

      t.timestamps null: false
    end
  end
end
