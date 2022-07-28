import "dotenv/config";
import nodemailer from "nodemailer";

const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

const sendEmail = async (options: any) => {
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Audiophile <audiophile@audiophile.com>",
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  return await transport.sendMail(mailOptions);
};

export default sendEmail;
