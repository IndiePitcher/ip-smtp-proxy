const sendmail = require('sendmail')({
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    devPort: 2525, // Default: False
    devHost: 'localhost', // Default: localhost
    smtpPort: 2525, // Default: 25
    smtpHost: 'localhost', // Default: -1 - extra smtp host after resolveMX
    username: 'indiepitcher',
    password: 'fekal',
  })

export async function sendTestEmail() {
    sendmail({
        from: 'no-reply@yourdomain.com',
        to: 'test@qq.com',
        subject: 'test sendmail',
        html: '<b>Mail of test sendmail</b>',
      }, function(err: any, reply: any) {
        console.log("send test error: " + err);
        console.log("send test reply: " + reply);
    });
}