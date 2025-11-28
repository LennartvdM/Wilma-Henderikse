import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    captcha: ''
  });

  const [captcha] = useState({
    first: 11,
    second: 15,
    answer: 26
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate captcha
    if (parseInt(formData.captcha) !== captcha.answer) {
      alert('U heeft het verkeerde nummer in de captcha ingevoerd.');
      return;
    }

    // Here you would normally send the form data to a server
    // For now, we'll just show an alert
    const mailtoLink = `mailto:info@wilmahenderikse.nl?subject=Contact formulier&body=Naam: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0ABericht:%0D%0A${formData.message}`;
    window.location.href = mailtoLink;
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: '',
      captcha: ''
    });
  };

  return (
    <section className="et_pb_section contact-section">
      <div className="et_pb_row contact-title-row">
        <div className="et_pb_column contact-column">
          <div className="et_pb_text contact-title">
            <div className="et_pb_text_inner">
              <h2>
                Vragen?<br />
                <span className="contact-subtitle">Hier kunt u mij bereiken</span>
              </h2>
            </div>
          </div>
          <div className="et_pb_text contact-email">
            <div className="et_pb_text_inner">
              <h1>
                <a href="mailto:info@wilmahenderikse.nl">
                  <strong>info@wilmahenderikse.nl</strong>
                </a>
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="et_pb_row contact-form-row">
        <div className="et_pb_column contact-form-column">
          <div className="et_pb_contact_form_container">
            <div className="et-pb-contact-message"></div>
            <div className="et_pb_contact">
              <form className="et_pb_contact_form" onSubmit={handleSubmit}>
                <p className="et_pb_contact_field et_pb_contact_field_half">
                  <label htmlFor="contact_name" className="et_pb_contact_form_label">
                    Naam
                  </label>
                  <input
                    type="text"
                    id="contact_name"
                    className="input"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Naam"
                    required
                  />
                </p>
                <p className="et_pb_contact_field et_pb_contact_field_half et_pb_contact_field_last">
                  <label htmlFor="contact_email" className="et_pb_contact_form_label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    className="input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </p>
                <p className="et_pb_contact_field et_pb_contact_field_last">
                  <label htmlFor="contact_message" className="et_pb_contact_form_label">
                    Bericht
                  </label>
                  <textarea
                    id="contact_message"
                    className="et_pb_contact_message input"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Bericht"
                    rows="5"
                    required
                  ></textarea>
                </p>
                <div className="et_contact_bottom_container">
                  <div className="et_pb_contact_right">
                    <p className="clearfix">
                      <span className="et_pb_contact_captcha_question">
                        {captcha.first} + {captcha.second}
                      </span>
                      {' = '}
                      <input
                        type="text"
                        size="2"
                        className="input et_pb_contact_captcha"
                        name="captcha"
                        value={formData.captcha}
                        onChange={handleChange}
                        required
                      />
                    </p>
                  </div>
                  <button type="submit" className="et_pb_contact_submit et_pb_button">
                    Verzenden
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;

