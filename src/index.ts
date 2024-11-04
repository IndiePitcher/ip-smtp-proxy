import express, { Request, Response } from 'express';
import { simpleParser } from 'mailparser';
import { SMTPServer } from 'smtp-server';
import { sendTestEmail } from './sendTestEmail';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express xxx!');
});

app.get('/test', async (req: Request, res: Response) => {
  await sendTestEmail();
  res.send('Hello, TypeScript with Express!');
});

app.listen(PORT, () => {
  console.log(`This is IndiePitcher proxy SMTP server.`);
});

// SMTP Server

// async function handleData(stream, session, callback) {
//   try {
//     const parsed = await simpleParser(stream);
    
//     await this.resend.emails.send({
//       from: session.fromAddress,
//       to: session.toAddress,
//       subject: parsed.subject,
//       html: parsed.html || parsed.textAsHtml,
//       text: parsed.text
//     });

//     callback();
//   } catch (error) {
//     console.error('Error processing email:', error);
//     callback(new Error('Error processing email'));
//   }
// }

const smtp = new SMTPServer({
  authOptional: true,
  disabledCommands: ['STARTTLS'],
  onAuth(auth, session, callback) {
    console.log(`username: ${auth.username}, password: ${auth.password}`);
    callback(null, { user: auth.password }); // where 123 is the user id or similar property
  },
  async onData(stream, session, callback) {

    // if (session.user

    try {
      const parsed = await simpleParser(stream);
      console.log('-------------------');
      console.log(session.user);
      console.log(parsed.html);
      console.log(parsed.subject);
      console.log(parsed.from?.text);
      console.log('-------------------');
      // console.log(JSON.stringify(parsed));
      callback();
    } catch (error) {
      console.error('Error processing email:', error);
      callback(new Error('Error processing email'));
    }
  },
});

const SMTP_PORT = process.env.SMTP_PORT || 2525;

smtp.listen(SMTP_PORT, () => {
  console.log(`SMTP server listening on port ${SMTP_PORT}`);
});
