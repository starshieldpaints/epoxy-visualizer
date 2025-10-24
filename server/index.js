const express = require('express');
const bodyParser = require('body-parser');
const sendgrid = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());

app.post("/send-result", async (req, res) => {
  const { email, name, baseColor, flakeType, screenshot } = req.body;
  if (!email || !screenshot) return res.status(400).send({ error: "Missing email or screenshot" });

  const msg = {
    to: email,
    from: 'support@starshieldpaints.com',
    subject: 'Your Epoxy Floor Visualizer Result',
    html: `
      <p>Hello ${name},<br/> See your epoxy floor design below:</p>
      <p><strong>Base Color:</strong> ${baseColor}</p>
      <p><strong>Flake Type:</strong> ${flakeType}</p>
      <img src="cid:epoxyimg" width="350"/><br/>
    `,
    attachments: [{
      content: screenshot.split(',')[1],
      filename: 'epoxy-floor-result.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'epoxyimg'
    }]
  };

  try {
    await sendgrid.send(msg);
    res.json({ status: "Email sent" });
  } catch (err) {
    console.error("SendGrid error:", err);
    if (err.response) {
      console.error(err.response.body);
    }
    res.status(500).json({ error: err.message });
  }
});


app.post("/send-pdf-report", async (req, res) => {
  const { to, name, pdfBase64, summary } = req.body;

  if (!to || !pdfBase64) {
    return res.status(400).send({ error: "Missing 'to' or 'pdfBase64' field" });
  }

  try {
    const pdfContent = pdfBase64.split("base64,")[1];
    const htmlBody = `
      <h1>Hi ${name},</h1>
      <p>Thanks for using the Starshield Epoxy Calculator. Your customized PDF report is attached.</p>
      <h3>Project Summary:</h3>
      <ul>
        ${summary.map(item => `<li><strong>${item.label}:</strong> ${item.value}</li>`).join('')}
      </ul>
      <p>Best regards,<br>The Starshield Team</p>
    `;
    const msg = {
      to: to,
      from: 'support@starshieldpaints.com',
      subject: 'Your Starshield Epoxy Kit Report',
      html: htmlBody,
      attachments: [
        {
          content: pdfContent,
          filename: 'Starshield_Epoxy_Report.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };
    await sendgrid.send(msg);
    res.json({ status: "Email sent successfully" });

  } catch (err) {
    console.error("SendGrid error:", err);
    if (err.response) {
      console.error(err.response.body);
    }
    res.status(500).json({ error: err.message });
  }
});


app.listen(4000, () => console.log("Server running on 4000"));