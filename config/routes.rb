Rails.application.routes.draw do

  devise_for :clients
  
  mount Shoppe::Engine => "/shoppe"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # Functions
  match "checkout", to: "orders#checkout", as: "checkout", via: [:get, :patch]
  match "checkout/pay", to: "orders#payment", as: "checkout_payment", via: [:get, :post]
  match "checkout/confirm", to: "orders#confirmation", as: "checkout_confirmation", via: [:get, :post]
  match "my_orders", to: "orders#my_orders", as: "my_orders", via: [:get]

  match "remove_item", to: "orders#remove_item", as: "remove_item", via: [:get]
  match "increase_item_quantity", to: "orders#increase_item_quantity", as: "increase_item_quantity", via: [:get]
  match "decrease_item_quantity", to: "orders#decrease_item_quantity", as: "decrease_item_quantity", via: [:get]

  #Nurse Wear
  match "nurse_tops", to: "products#nurse_tops", as: "nurse_tops", via: [:get]
  match "nurse_sets", to: "products#nurse_sets", as: "nurse_sets", via: [:get]
  match "nurse_coats", to: "products#nurse_sets", as: "nurse_coats", via: [:get]
  match "nurse_pants", to: "products#nurse_sets", as: "nurse_pants", via: [:get]
  match "accessories", to: "products#accessories", as: "accessories", via: [:get]
  match "nurse_caps", to: "products#nurse_caps", as: "nurse_caps", via: [:get]
  
  #Mentality
  match "mentality_stretchflex", to: "products#mentality_stretchflex", as: "mentality_stretchflex", via: [:get]
  match "mentality_hyflex", to: "products#mentality_hyflex", as: "mentality_hyflex", via: [:get]

  #Stethoscopes
  match "stethoscopes", to: "products#stethoscopes", as: "stethoscopes", via: [:get]

  #Chef Wear
  match "chef_coats", to: "products#chef_coats", as: "chef_coats", via: [:get]
  match "chef_pants", to: "products#chef_pants", as: "chef_pants", via: [:get]
  match "chef_hats", to: "products#chef_hats", as: "chef_hats", via: [:get]
  match "chef_tops", to: "products#chef_tops", as: "chef_tops", via: [:get]
  match "aprons", to: "products#aprons", as: "aprons", via: [:get]
  match "waitress_vests", to: "products#waitress_vests", as: "waitress_vests", via: [:get]

  #work wear
  match "work_fire_retardent", to: "products#work_fire_retardent", as: "work_fire_retardent", via: [:get]
  match "work_shop_coat", to: "products#work_shop_coat", as: "work_shop_coat", via: [:get]
  match "work_coverall_overall", to: "products#work_coverall_overall", as: "work_coverall_overall", via: [:get]
  match "work_pants", to: "products#work_pants", as: "work_pants", via: [:get]
  match "work_shirts", to: "products#work_shirts", as: "work_shirts", via: [:get]
  match "work_vests", to: "products#work_vests", as: "work_vests", via: [:get]

  #clearance
  match "clearance", to: "products#clearance", as: "clearance", via: [:get]
  

  get "product/:permalink", to: "products#show", as: "product"
  post "product/:permalink", to: "products#buy", as: "buy"
  delete "product/:permalink", to: "products#remove", as: "remove"
  root to: "products#index"

  match "contact", to: "products#contact", as: "contact", via: [:get]

  get "basket", to: "orders#show"
  delete "basket", to: "orders#destroy"
  
  # Example of regular route:
  get 'products/:id' => 'catalog#view' 

  # Example of named route that can be invoked with purchase_url(id: product.id)
  get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

end
