# IndiePitcher SMTP Proxy

SMTP proxy server for [IndiePitcher](https://indiepitcher.com) - enables sending transactional emails via SMTP protocol.

## Overview

This service provides an SMTP interface to IndiePitcher's email API, allowing integration with services like Supabase Auth, Firebase Auth, and other platforms that require SMTP for sending emails.

## SMTP Credentials

- **Host**: `smtp.indiepitcher.com`
- **Port**: `587`
- **Username**: `indiepitcher`
- **Password**: `YOUR_API_KEY`

**Note**: Set "enable secure connection" to false if asked. The connection will be upgraded to SSL/TLS using `STARTTLS` command on successful connection.

## Features

- **HTML Email Support**: Send custom HTML emails
- **Markdown Support**: Send emails using markdown syntax wrapped in `<indiepitcher-markdown>` tags
- **Integration Ready**: Works with popular authentication services (Supabase, Firebase, etc.)
- **Dashboard Integration**: All SMTP emails appear alongside REST API emails in the IndiePitcher dashboard

## Markdown Email Example

```html
<indiepitcher-markdown>
Hi there,

You have been invited to create a user on [IndiePitcher](https://indiepitcher.com).

<button ip:no-track href="https://app.indiepitcher.com/register">Accept the invite</button>
<br/>

Thanks,

Your IndiePitcher team
</indiepitcher-markdown>
```

## Limitations

To prevent abuse, the following limitations are in place:

- ✅ HTML emails only (plaintext not supported)
- ❌ Single recipient only (no multiple recipients)
- ❌ Cc/Bcc fields not supported
- ℹ️ From field is ignored - IndiePitcher uses the sender defined in your project's settings

### Recommended Sender Configuration

To ensure your configured project sender is used:

- **Sender name**: `indiepitcher-ignore-sender-replyto`
- **Sender email**: anything (will be ignored)
- **Reply to**: anything (will be ignored)

## Usage Warning

⚠️ **Do not send bulk/marketing emails** through the SMTP proxy. This service is intended for transactional emails such as:

- Password resets
- Welcome emails
- Account verification
- User-triggered notifications

The service has extensive checks, especially for free tier users. Contact [support](mailto:petr@indiepitcher.com) if you have a valid use case for bulk emails.

## Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
npm install
```

### Scripts

- `npm run dev` - Run development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm test` - Run Jest tests
- `npm run typecheck` - Check TypeScript types

### Environment Variables

- `PORT` - Server port (default: 8080)
- `SENTRY_DSN` - Sentry error tracking DSN
- `MIXPANEL_TOKEN` - Mixpanel analytics token
- `privkey` - Base64 encoded SSL private key
- `cert` - Base64 encoded SSL certificate

## Documentation

For complete documentation, visit: https://docs.indiepitcher.com/smtp

## Deployment

This service is configured for deployment on [Fly.io](https://fly.io) with automated GitHub Actions deployment.

## License

ISC
