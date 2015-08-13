class Client < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :purchases
  belongs_to :country, class_name: "Shoppe::Country", foreign_key: "country_id"

  geocoded_by :full_street_address   # can also be an IP address
	after_validation :geocode          # auto-fetch coordinates

	def full_street_address
			self.address1 + self.address2 + self.city + self.state + self.postcode + self.country.name
  end
end
