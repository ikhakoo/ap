class CreateStylecharts < ActiveRecord::Migration
  def change
    create_table :stylecharts do |t|
      t.integer :product_id

      t.timestamps null: false
    end
  end
end
