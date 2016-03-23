class UserMailer < ApplicationMailer
	def send_order_confirmation(order, client)
  	@order = order
  	@client = client
  	mail from: Shoppe.settings.outbound_email_address, to: @client.email, subject: "AP Uniforms Order Confirmation"
  end

  def send_admin_notification(order, client)
  	@order = order
  	@client = client
  	mail from: Shoppe.settings.outbound_email_address, to: "apuniforms@gmail.com", subject: "New Order from: #{@client.email}"
  end
end