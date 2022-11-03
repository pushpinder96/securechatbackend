var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'pushpindertechdemo@outlook.com',
    pass: 'ONEvsall123$'
  }
});

var mailOptions = {
  from: 'pushpindertechdemo@outlook.com',
  to: 'princesainicenation@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
