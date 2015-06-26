class OrdersController < ApplicationController

	def destroy
	  current_order.destroy
	  session[:order_id] = nil
	  redirect_to root_path, :notice => "Basket emptied successfully."
	end

	def checkout
  @order = Shoppe::Order.find(current_order.id)
	  if request.patch?
	  	binding.pry
	    if @order.proceed_to_confirm(checkout_params)
	      redirect_to checkout_payment_path
	    end
	  end
	end

	def payment
	  @order = Shoppe::Order.find(current_order.id)
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
	    session[:order_id] = nil
	    redirect_to root_path, :notice => "Order has been placed successfully!"
	  end
	end

 private
	def checkout_params
    params.require(:order).permit(:first_name)
  end

end
