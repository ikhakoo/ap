class Clients::RegistrationsController < Devise::RegistrationsController
 before_filter :configure_sign_up_params, only: [:create]
 before_filter :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
   def new
      super
   end

  # POST /resource
   def create
    devise_parameter_sanitizer.for(:sign_up) << [:first_name, :last_name, :address1, :address2, :suite, :city, :state, :country_id, :postcode, :phone_number, :latitude, :longitude]
    super
   end

  # GET /resource/edit
   def edit
     super
   end

  # PUT /resource
   def update
     super
   end

  # DELETE /resource
   def destroy
     super
   end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
   def cancel
     super
   end

protected
  # You can put the params you want to permit in the empty array.
   def configure_sign_up_params
      devise_parameter_sanitizer.for(:sign_up) do |u|
        u.permit(:first_name, :last_name, :address1, :address2, :suite, :city, :state, :country_id, :postcode, :phone_number, :email, :latitude, :longitude, :password)
      end
   end

  # You can put the params you want to permit in the empty array.
    def configure_account_update_params
      devise_parameter_sanitizer.for(:account_update) do |u|
        u.permit(:first_name, :last_name, :address1, :address2, :suite, :city, :state, :country_id, :postcode, :phone_number, :email, :latitude, :longitude, :password, :current_password)
      end
    end

  # The path used after sign up.
   def after_sign_up_path_for(resource)
     super(resource)
   end


    # The path used after sign up for inactive accounts.
     def after_inactive_sign_up_path_for(resource)
       super(resource)
     end

     # def make_student
     #  @user = current_user
     #  @user.role = "student"
     #  @user.save
     # end
end
