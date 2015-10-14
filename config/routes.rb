Rails.application.routes.draw do

  devise_for :clients, :controllers => { registrations: 'clients/registrations', sessions: 'clients/sessions' }
  
  mount Shoppe::Engine => "/shoppe"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # Functions
  match "checkout", to: "orders#checkout", as: "checkout", via: [:get, :patch]
  match "checkout/pay", to: "orders#payment", as: "checkout_payment", via: [:get, :post]
  match "checkout/confirm", to: "orders#confirmation", as: "checkout_confirmation", via: [:get, :post]
  match "my-orders", to: "orders#my_orders", as: "my_orders", via: [:get]
  match "search", to: "search#index", as: "search", via: [:get]

  match "remove_item", to: "orders#remove_item", as: "remove_item", via: [:get]
  match "increase_item_quantity", to: "orders#increase_item_quantity", as: "increase_item_quantity", via: [:get]
  match "decrease_item_quantity", to: "orders#decrease_item_quantity", as: "decrease_item_quantity", via: [:get]
  match "bulk_update_quantity", to: "orders#bulk_update_quantity", as: "bulk_update_quantity", via: [:get]

  #Nurse Wear
  match "nurse-wear/tops", to: "products#nurse_tops", as: "nurse_tops", via: [:get]
  match "nurse-wear/sets", to: "products#nurse_sets", as: "nurse_sets", via: [:get]
  match "nurse-wear/coats", to: "products#nurse_coats", as: "nurse_coats", via: [:get]
  match "nurse-wear/pants", to: "products#nurse_pants", as: "nurse_pants", via: [:get]
  match "accessories", to: "products#accessories", as: "accessories", via: [:get]
  match "nurse-wear/caps", to: "products#nurse_caps", as: "nurse_caps", via: [:get]
  match "nurse-wear/dresses-gowns", to: "products#nurse_gowns", as: "nurse_gowns", via: [:get]

  resources :contact_forms
  
  #Mentality
  match "mentality", to: "products#mentality", as: "mentality", via: [:get]
  match "mentality/stretchflex", to: "products#mentality_stretchflex", as: "mentality_stretchflex", via: [:get]
  match "mentality/hyflex", to: "products#mentality_hyflex", as: "mentality_hyflex", via: [:get]

  #Stethoscopes
  match "stethoscopes", to: "products#stethoscopes", as: "stethoscopes", via: [:get]

  #Chef Wear
  match "chef-wear/coats", to: "products#chef_coats", as: "chef_coats", via: [:get]
  match "chef-wear/pants", to: "products#chef_pants", as: "chef_pants", via: [:get]
  match "chef-wear/hats", to: "products#chef_hats", as: "chef_hats", via: [:get]
  match "chef-wear/tops", to: "products#chef_tops", as: "chef_tops", via: [:get]
  match "chef-wear/aprons", to: "products#aprons", as: "aprons", via: [:get]
  match "chef-wear/waitress-vests", to: "products#waitress_vests", as: "waitress_vests", via: [:get]

  #work wear
  match "work-wear/fire-retardent", to: "products#work_fire_retardent", as: "work_fire_retardent", via: [:get]
  match "work-wear/shop-coat", to: "products#work_shop_coat", as: "work_shop_coat", via: [:get]
  match "work-wear/coverall-overall", to: "products#work_coverall_overall", as: "work_coverall_overall", via: [:get]
  match "work-wear/pants", to: "products#work_pants", as: "work_pants", via: [:get]
  match "work-wear/shirts", to: "products#work_shirts", as: "work_shirts", via: [:get]
  match "work-wear/safety-vests", to: "products#work_vests", as: "work_vests", via: [:get]

  #clearance
  match "clearance", to: "products#clearance", as: "clearance", via: [:get]
  
  #pages
  match "terms", to: "pages#terms", as: "terms", via: [:get]
  match "returns", to: "pages#returns", as: "returns", via: [:get]
  match "about-us", to: "pages#about_us", as: "about_us", via: [:get]
  match "privacy", to: "pages#privacy", as: "privacy", via: [:get]
  match "pick-up", to: "pages#pick_up", as: "pick_up", via: [:get]


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
