class OrdersController < ApplicationController

	def destroy
	  current_order.destroy
	  session.delete :order_id
	  redirect_to root_path, :notice => "Basket emptied successfully."
	end

	def checkout
		if !current_client.nil?
		  @order 		= Shoppe::Order.find(current_order.id)
		  
			  if request.patch?
			    if @order.proceed_to_confirm(params[:order].permit(:first_name, :last_name, :billing_address1, :billing_address2, :billing_address3, :billing_address4, :billing_country_id, :billing_postcode, :email_address, :phone_number))
			      redirect_to checkout_payment_path
			    end
			  end
		else
			redirect_to new_client_session_path,
			:alert => "You must be logged in to proceed!"
		end
	end

	def payment
  @order = current_order
	  if request.post?
	    if @order.accept_stripe_token(params[:stripe_token])
	      redirect_to checkout_confirmation_path
	    else
	      flash.now[:notice] = "Could not exchange Stripe token. Please try again."
	    end
	  end
	end

	def confirmation
	  if request.post?
		    current_order.confirm!
		    Purchase.create!(order_id: current_order.id, client_id: current_client.id)
		    session[:order_id] = nil
		    redirect_to root_path, :notice => "Order has been placed successfully!"
	  end
	end

	def my_orders
		if current_client
			@my_orders = Purchase.where(client_id: current_client.id)
			@my_orders = @my_orders.map(&:order_id)
			@orders 	 = Shoppe::Order.where(id: @my_orders)
		else
			redirect_to root_path, :alert => "You must be logged in to view your orders"
		end
	end

end
