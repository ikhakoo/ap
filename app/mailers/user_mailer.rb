class UserMailer < ActionMailer::Base
	def send_order_confirmation(order, client)
  	@order = order
  	@client = client
  	mail from: "AP Uniforms :: #{Shoppe.settings.outbound_email_address}", to: @client.email, subject: "AP Uniforms Order Confirmation"
  end

  def send_admin_notification(order, client)
  	@order = order
  	@client = client
  	mail from: Shoppe.settings.outbound_email_address, to: "apuniforms@gmail.com", subject: "New Order from: #{@client.email}"
  end

  def bad_orders_deleted
    mail from: Shoppe.settings.outbound_email_address, to: "dvorkin212@gmail.com", subject: "Bad Orders Deleted"
  end
end