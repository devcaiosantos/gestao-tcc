import * as nodemailer from "nodemailer";

const sendEmail = async ({ user, pass, from, to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  try {
    await transporter.sendMail({
      from: from,
      to: to,
      subject: subject,
      text: text,
    });
    return {
      status: "success",
      message: "E-mail enviado com sucesso para " + to,
    };
  } catch (error) {
    return {
      status: "error",
      message: `Falha ao enviar e-mail para ${to} \n${error}`,
    };
  }
};

export default sendEmail;
