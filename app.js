const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const password = require('./keys');

const app = express();

// View engine setup
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("contact");
});

app.post("/send", (req, res) => {
  const output = `
        <p>You have a new contact request</p>
        <h3>Contact Deails</h3>
        <ul>
            <li>Name: ${req.body.name}<li>
            <li>Company: ${req.body.company}<li>
            <li>Email: ${req.body.email}<li>
            <li>Phone: ${req.body.phone}<li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'd0xapatin@gmail.com', // generated ethereal user
      pass: password.password // generated ethereal password
    },
    tls:{
        rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Dorian Sabo" <dorian.sabo@brightmarbles.io>', // sender address
    to: "dorian.sabo@brightmarbles.io", // list of receivers
    subject: "Node contact request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render('contact', {
        msg: 'Email has been sent'
    })
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
