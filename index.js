require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("cron");
const fs = require("fs"); // To read the resume file
const path = require("path");
// const hrEmails = require("./email.json").hrEmails;

const jsonContent = fs.readFileSync(path.join(__dirname, "email.json"), "utf8");
const parsedData = JSON.parse(jsonContent);

const hrEmails = parsedData.hrEmails
  .map((entry) => entry.email)
  .filter((email) => email !== "");

// Email draft template
const emailDraft = {
  subject: "Application for Software Development Role - Frontend / FullStack",
  text: `Hi,
I hope this email finds you well. My name is Md Anas Sabah, and I am currently an SDE Intern at AgentProd, a generative AI-based company specializing in AI sales representatives. I am writing to express my interest in joining the innovative team at your company.

At AgentProd, I worked on AI projects and developed scalable applications using TypeScript, Next.js, Supabase, Python, and PostgreSQL. Key accomplishments include:

- Contributing to an AI-driven sales platform, increasing client engagement by 30%.
- Built an automated feature to extract Zoom/Gong meeting transcripts, generate notes, update HubSpot after AE Slack approval, and email clients summaries with unanswered questions and next steps from Sales RAG.
- Developing high-performance web applications with Next.js and Supabase.
- Optimizing database management with PostgreSQL, improving data retrieval times by 20%.

My technical skills and experience in both frontend and backend development make me well-suited for the company. I am excited about the opportunity to contribute to your team and help drive your technological advancements.

I have attached my resume for your reference.

Best Regards,
Md Anas Sabah`,
  attachments: [
    {
      filename: "AnasResumeSDE.pdf",
      path: path.join(__dirname, "AnasResumeSDE.pdf"), // Path to the resume file
      contentType: "application/pdf",
    },
  ],
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = (recipient) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipient,
    subject: emailDraft.subject,
    text: emailDraft.text,
    attachments: emailDraft.attachments,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email to", recipient, error);
    } else {
      console.log("Email sent to", recipient, info.response);
    }
  });
};

let emailIndex = 0;
const emailJob = new cron.CronJob("*/3 * * * * *", () => {
  if (emailIndex < hrEmails.length) {
    sendEmail(hrEmails[emailIndex]);
    emailIndex++;
  } else {
    console.log("All emails sent!");
    emailJob.stop();
  }
});

emailJob.start();

console.log("Email system started. Sending emails every 3 seconds...");
