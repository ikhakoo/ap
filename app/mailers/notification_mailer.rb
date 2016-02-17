module Shoppe
  class NotificationMailer < ActionMailer::Base

    def order_received(order)
      @order = order
      staff = Shoppe::User.all.map(&:email_address)
      mail from: Shoppe.settings.outbound_email_address, to: staff, subject: "New Order Received"
    end

    def order_confirmation(order)
    	client = Client.find_by_id(order.client_id)
    	mail from: 'apuniforms@gmail.com(NO REPLY)', to: client.email
    end

  end
end