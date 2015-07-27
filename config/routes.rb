Rails.application.routes.draw do

  devise_for :clients
  
  mount Shoppe::Engine => "/shoppe"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"

  match "checkout", to: "orders#checkout", as: "checkout", via: [:get, :patch]
  match "checkout/pay", to: "orders#payment", as: "checkout_payment", via: [:get, :post]
  match "checkout/confirm", to: "orders#confirmation", as: "checkout_confirmation", via: [:get, :post]
  match "my_orders", to: "orders#my_orders", as: "my_orders", via: [:get]

  match "nurse_tops", to: "products#nurse_tops", as: "nurse_tops", via: [:get]
  match "nurse_sets", to: "products#nurse_sets", as: "nurse_sets", via: [:get]
  match "stethoscopes", to: "products#stethoscopes", as: "stethoscopes", via: [:get]
  match "chef", to: "products#chef", as: "chef", via: [:get]
  match "work", to: "products#work", as: "work", via: [:get]
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

  # Example resource route (maps HTTP verbs to controller actions automatically):
  # resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
