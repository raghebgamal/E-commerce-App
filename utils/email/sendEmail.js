const nodemailer = require("nodemailer");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './../../config.env') })

module.exports = class Email{
    constructor(user, subject, message) {
        this.user=user
        this.to = user.email;
        this.subject = subject;
        this.from = process.env.EMAIL;
        this.text=message
    }
   
    transporter() {

        if (process.env.NODE_ENV === 'production') {
         
            return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      
        }
    
        return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
        
    }
    
    async send() {

        const mailoption = {
            to: this.to, 
        from: this.from ,
        subject: this.subject,
        text:this.text,
          
          
       }
     
        await this.transporter().sendMail(mailoption);
     

    }


   async  sendEmail() {
       await this.send()
  }
  
  
}

