class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_order, :has_order?, :select_background_type

  # takes in two inputs at all times, and figures out what kind of div box to spit out.
  def select_background_type(b1, b2)
      # figures out if b requires a url or an rgb color
      def figure_out(b) 
        if b == nil
          output = 'display: none;'
          return output
        elsif b.split(" ").first == 'background'
          raw = b.split("background")[1]
          image_name = raw[1..raw.length]
          output = "background-image: url('/assets/patterns/"+image_name+".jpg'); background-size: 100%;"
          return output
        else 
          # b2 is going to be an rgb color.
          output = 'background-color: '+b 
          return output
        end 
      end

      background1 = figure_out(b1)
      background2 = figure_out(b2)

      html = [background1, background2]

      return html
  end 

   

 private

  def current_order
    @current_order ||= begin
      if has_order?
        @current_order
      else
        order = Shoppe::Order.create(:ip_address => request.ip)
        session[:order_id] = order.id
        order
      end
    end
  end

  def has_order?
    !!(
      session[:order_id] &&
      @current_order = Shoppe::Order.includes(:order_items => :ordered_item).find_by_id(session[:order_id])
    )
  end

  def free_shipping?(order)
    @order = order
    @order.total_before_tax - @order.delivery_price > 100
  end

end
	
