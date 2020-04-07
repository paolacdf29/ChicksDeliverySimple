"use strict";
const nodemailer = require("nodemailer");

async function main(obj) {
    // let correoUsuario = req.body.correo;
    // let textoUsuario = req.body.texto;


  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'paolacdf29@gmail.com', // generated ethereal user
      pass: '22020750' // generated ethereal password
    },
    
    rejectUnauthorized : false
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    to: obj.to, // list of receivers
    subject: obj.subject, // Subject line
    text: obj.text // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  return info.messageId;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// main().catch(console.error);
module.exports = {main}