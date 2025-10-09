const express = require('express');
const bodyParser = require('body-parser');
const sendgrid = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());

app.post("/send-result", async (req, res) => {
  const { email, name, baseColor, flakeType, screenshot } = req.body;
  if (!email || !screenshot) return res.status(400).send({ error: "Missing email or screenshot" });

  const msg = {
    to: email,
    from: 'your-verified-sendgrid@example.com',
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
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log("Server running on 4000"));
