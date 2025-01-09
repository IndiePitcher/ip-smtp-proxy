import express, { Request, Response } from 'express';
import { AddressObject, simpleParser } from 'mailparser';
import { SMTPServer } from 'smtp-server';
import { sendTestEmail } from './sendTestEmail';
import { IndiePitcher } from 'indiepitcher';
import Mixpanel from 'mixpanel';
import { extractMarkdown } from './extractmarkdown';
const Sentry = require('@sentry/node');

const mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN ?? 'xxx');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', async (req: Request, res: Response) => {
  res.send('To use IndiePitcher\'s SMTP proxy server:\nhost: smtp.indiepitcher.com\nport: 587\nusername: indiepitcher\npassword: YOUR_API_KEY');
});

// app.get('/test', async (req: Request, res: Response) => {
//   await sendTestEmail();
//   res.send('Hello, TypeScript with Express!');
// });

app.listen(PORT, () => {
  console.log(`This is IndiePitcher proxy SMTP server. Listening on port ${PORT}`);
});

// SMTP Server

const privkey = atob(process.env.privkey ?? '');
const cert = atob(process.env.cert ?? '');

const smtp = new SMTPServer({
  secure: false,
  key: privkey,
  cert: cert,
  // disabledCommands: ['STARTTLS'],
  async onAuth(auth, session, callback) {
    
    if (auth.username !== "indiepitcher") {
      Sentry.captureException(new Error("Username must be set to 'indiepitcher'"));
      return callback(new Error("Username must be set to 'indiepitcher'"));
    }

    if (!auth.password) {
      Sentry.captureException(new Error("API key must be set as the password"));
      return callback(new Error("API key must be set as the password"));
    }

    const indiepitcher = new IndiePitcher(auth.password);
    try {
      // TODO: add some sort of check token method
      await indiepitcher.listContacts();
      callback(null, { user: auth.password });
    } catch (error) {
      console.error('Error authenticating:', error);
      Sentry.captureException(error);
      return callback(new Error('Error authenticating. Make sure you have provided a valid IndiePitcher API key as the password.'));
    }
  },
  async onData(stream, session, callback) {
    session.hostNameAppearsAs
    try {
      if (!session.user) {
        console.error('No user found');
        Sentry.captureException(new Error('No user found'));
        callback(new Error('No user found'));
        return;
      }
      const indiepitcher = new IndiePitcher(session.user);
      const parsed = await simpleParser(stream);

      if (!parsed.html) {
        console.error('Only html emails are currently supported');
        Sentry.captureException(new Error('Only html emails are currently supported'));
        callback(new Error('Only html emails are currently supported'));
        return;
      }

      const toEmails = (parsed.to as AddressObject).value;

      if (!toEmails || toEmails.length === 0) {
        console.error('No to email found');
        Sentry.captureException(new Error('No to email found'));
        callback(new Error('No to email found'));
        return;
      }

      if (toEmails.length > 1) {
        console.error('Only one to email is currently supported');
        Sentry.captureException(new Error('Only one to email is currently supported'));
        callback(new Error('Only one to email is currently supported'));
        return;
      }

      const to = toEmails[0];

      const markdown = await extractMarkdown(parsed.html);

      if (markdown) {
        if (markdown.length ===0) {
          throw new Error('Found <indiepitcher-markdown></indiepitcher-markdown> with empty body, this is not allowed. Please provide a markdown body or remove the tag to send an HTML email.');
        }
        await indiepitcher.sendEmail({
          to: to.address ?? '',
          subject: parsed.subject ?? '',
          body: markdown,
          bodyFormat: 'markdown',
        });
      } else {
        await indiepitcher.sendEmail({
          to: to.address ?? '',
          subject: parsed.subject ?? '',
          body: parsed.html,
          bodyFormat: 'html',
        });
      }

      console.log(`${session.hostNameAppearsAs} | ${session.clientHostname} | ${session.remoteAddress} - Email ${parsed.subject} sent to '${to.name}' '${to.address}' | body: '${parsed.html?.substring(0, 50)}...'`);

      callback();

    } catch (error) {
      console.error('Error processing email:', error);
      Sentry.captureException(error);
      callback(new Error('Error processing email'));
    }
  },
});

smtp.on("error", (error) => {
  Sentry.captureException(error);
  console.log("Error %s", error.message);
});

const SMTP_PORT: number = 587;

smtp.listen(SMTP_PORT, () => {
  console.log(`SMTP server listening on port ${SMTP_PORT}`);
});
