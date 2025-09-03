const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Verify connection on startup
transporter.verify()
  .then(() => console.log("✅ Mailer ready"))
  .catch(err => console.error("❌ Mailer error:", err));

/**
 * Send email using HTML template
 * @param {Object} options
 * @param {string} options.to - recipient
 * @param {string} options.subject - subject
 * @param {string} options.template - template file name (inside /src/mail-templates)
 * @param {Object} options.context - variables to replace in template
 * @param {string|string[]} [options.cc] - CC recipients
 * @param {string|string[]} [options.bcc] - BCC recipients
 * @param {Array} [options.attachments] - attachments [{filename, path}]
 */
exports.sendMail = async ({ to, subject, template, context = {}, cc, bcc, attachments }) => {
  const templatePath = path.join(__dirname, "../mail-templates", `${template}.html`);
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Email template not found: ${templatePath}`);
  }

  const source = fs.readFileSync(templatePath, "utf8");
  const compiled = handlebars.compile(source);
  const html = compiled(context);

  return transporter.sendMail({
    from: process.env.MAIL_FROM || "no-reply@myapp.com",
    to,
    cc,
    bcc,
    subject,
    html,
    attachments,
  });
};
