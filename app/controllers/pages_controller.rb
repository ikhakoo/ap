class PagesController < ApplicationController

	def contact_form
		@contact_form = ContactForm.new(params[:contact_form])

		if @contact_form.valid?
			@contact_form.deliver
			redirect_to root_path
		else
			@contact_form.errors.full_messages
		end

	end

 private
 	def contact_form_params
 		params.require(:contact_form).permit(:name, :email, :message)
 	end

end
