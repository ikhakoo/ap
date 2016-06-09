class ContactForm < MailForm::Base

  attribute :name,     :validate => true
  attribute :email,    :validate => /\A([\w\.%\+\-]+)@([\w\-]+\.)+([\w]{2,})\z/i
  
  attribute :phone 
  attribute :referral
  attribute :message
  attribute :nickname, :captcha => true

  def persisted?
    false
  end

  def headers
    {
      :subject => "AP",
      :to => "apuniforms.com@apuniforms.com",
      :from => %("#{name}" <#{email}>)
    }
  end

end