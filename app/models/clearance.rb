class Clearance < ActiveRecord::Base
	serialize :color
	serialize :available_size
end
