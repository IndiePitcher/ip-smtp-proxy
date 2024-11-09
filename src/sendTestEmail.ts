import { createTransport } from "nodemailer";

export async function sendTestEmail() {
  try {
    const transporter = createTransport({
      host: "smtp.indiepitcher.com",
      secure: false,
      port: 587,
      auth: {
        user: "indiepitcher",
        pass: "sc_3fac03575fe7fd114db9ae4861156ebcd3657f15d6dae0e55d2fdc42ddc28569"
      }
    });
  
    await transporter.sendMail({
      from: "fekal@zlo.zlo",
      to: "pavlipe7@gmail.com",
      subject: "Test email",
      html: "<b>Hello world</b>"
    });
  } catch (error) {
    console.error('Error sending test email email:', error);
  }
  
}