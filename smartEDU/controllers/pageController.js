import nodemailer from 'nodemailer';
import { User } from '../models/User.js';

const getIndexPage = async (req, res) => {
  res.status(200).render('index', {
    page_name: 'index',
  });
};

const getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

const getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

const getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login',
  });
};

const getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact',
  });
};

const sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1>Mail Details</h1>
  <ul>
    <li>Name: ${req.body.first_name} ${req.body.last_name} </li>
    <li>Email: ${req.body.email}</li>
    <li>Phone Number: ${req.body.phone}</li>
  </ul>
  <h2>Message</h2>
    <p>${req.body.message} </p>
  `;
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'mehmeterdemvural@gmail.com', // gmail account
        pass: 'krralzdimsskjezi', // gmail password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart Edu Contact Form" <mehmeterdemvural@gmail.com>', // sender address
      to: 'vuralm20@itu.edu.tr, mehmet.erdem.vural@icloud.com', // list of receivers
      subject: 'Smart Edu Contact Form New Mail ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: outputMessage, // html body
    });

    // console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    req.flash('success', 'We received your message succesfully ! !');

    res.status(200).redirect('contact');
  } catch (err) {
    // req.flash('error', `Something happened ! ! ${err}`);
    req.flash('error', `Something happened ! !`);

    res.status(200).redirect('contact');
  }
};

export {
  getAboutPage,
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getContactPage,
  sendEmail,
};
