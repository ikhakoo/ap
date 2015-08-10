class ContactFormsController < ApplicationController
	
	def new
    @contact_form = ContactForm.new(params[:contact_form])
  end

  def create
    @contact_form = ContactForm.new(params[:contact_form])
    
    if @contact_form.valid?
    	puts "im here --------------------------------------------------------------"
    	@contact_form.deliver
      redirect_to root_path, :notice => "We have received your message and will respond shortly"
    else
    	puts "im right here ---------------------------------------------------------------"
    	puts @contact_form.errors.full_messages
      render :new
    end

  end

 private
 	def contact_form_params
 		params.require(:contact_form).permit(:name, :email, :message, :phone, :referral)
 	end

end
