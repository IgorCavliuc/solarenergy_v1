// @ts-ignore
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

interface SolarPanelRequirementsInput {
  selectPanel: {
    nominalPowerWatt: number;
    price: number;
    area: {
      first: number;
      second: number;
    };
    moduleEfficiency: number;
  };
  roofType: {
    value: string;
  };
  averageMonthlyConsumption: number;
  sunlightHoursPerDay: number;
  costPerKWhMDL: number;
  roofHeight: number;
  houseLength: number;
  houseWidth: number;
  contact: {
    email: string;
    phone: string;
    name: string;
    lastname: string;
  };
}

const calculateSolarPanelRequirements = ({
  selectPanel,
  roofType,
  averageMonthlyConsumption,
  sunlightHoursPerDay,
  costPerKWhMDL,
  roofHeight,
  houseLength,
  houseWidth,
}: SolarPanelRequirementsInput) => {
  const { nominalPowerWatt, price, area } = selectPanel;

  // Calculate roof slope angle
  const roofSlopeAngleRadians =
    roofType.value === "singleSlope"
      ? Math.atan(roofHeight / houseWidth)
      : roofType.value === "gable"
        ? Math.atan(roofHeight / (houseWidth / 2))
        : 0;
  const roofSlopeAngleDegrees = roofSlopeAngleRadians * (180 / Math.PI);

  // Calculate roof area
  const roofArea =
    roofType.value === "flat"
      ? houseLength * houseWidth
      : roofType.value === "singleSlope" || roofType.value === "gable"
        ? (houseLength * houseWidth) / Math.cos(roofSlopeAngleRadians)
        : 0;

  // Calculate panel area
  const panelArea = (area.first * area.second) / 1000000;

  // Daily energy production per panel (kWh)
  const dailyEnergyProduction = (nominalPowerWatt * sunlightHoursPerDay) / 1000;

  // Calculate number of panels needed
  const panelsNeeded = Math.ceil(
    averageMonthlyConsumption / (dailyEnergyProduction * 30),
  );

  // Check if panels can be installed on the roof
  const totalPanelArea = panelsNeeded * panelArea;
  const canInstallPanels = totalPanelArea <= roofArea;

  // Calculate installation cost
  const installationCostPerPanel = 500; // Example installation cost per panel
  const totalCost =
    (panelsNeeded * price + panelsNeeded * installationCostPerPanel) * 3;

  // Calculate annual savings
  const annualEnergyProduction = dailyEnergyProduction * 365 * panelsNeeded;
  const annualSavings = annualEnergyProduction * costPerKWhMDL;

  // Calculate payback period
  const paybackPeriod = totalCost / annualSavings;

  return {
    panelsNeeded,
    totalCost,
    annualSavings,
    paybackPeriod,
    canInstallPanels,
    totalPanelArea,
    roofArea,
    roofSlopeAngleDegrees,
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const input: SolarPanelRequirementsInput = req.body;
    const data = calculateSolarPanelRequirements(input);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        type: "OAuth2",
        // clientId: process.env.OAUTH_CLIENTID,
        // clientSecret: process.env.OAUTH_CLIENT_SECRET,
        // refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
      pool: true, // Use pooled connections
      maxConnections: 1, // Max connections in the pool
      maxMessages: 3, // Max messages per connection
      rateDelta: 20000, // Max send rate in ms
      rateLimit: 5, // Max number of messages to send per rateDelta
      logger: true, // Enable logging for debugging
      debug: true, // Enable debug output
      connectionTimeout: 60000, // Connection timeout
      greetingTimeout: 30000, // Greeting timeout
      socketTimeout: 60000, // Socket timeout
    });

    const mailOptions = {
      from: "SolarEnergy <no-reply@solarenergy.com>",
      to: input.contact.email,
      subject: "Ваш запрос в ожидании",
      text: "Спасибо что воспользовались нашим сервисом!",
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Добро пожаловать в SolarEnergy!</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: rgba(208, 4, 103, 1);
            }
            .container {
              width: 500px;
              height: 900px;
              margin: 0 auto;
              padding: 20px;
              border-radius: 10px;
              background: white;
            }
            .header {
              text-align: center;
              background-color: rgba(255, 255, 255, 0.2);
              color: #fff;
              padding: 10px 0;
              border-radius: 10px 10px 0 0;
            }
            .content {
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.9em;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Расчет проекта установки солнечных панелей</h1>
            </div>
            <div class="content">
              <p>${input.contact.lastname} ${input.contact.name},
              <p>Ваш номер телефона ${input.contact.phone}, а также адрес электронной почты ${input.contact.email} были сохранены в нашей базе и скоро вам перезвонит наш менеджер.</p>
              <br/>
              <p>Расчет на <span>${data.panelsNeeded} солнечных панелей. </span> (общая площадь панелей <span> ${data.totalPanelArea?.toFixed(2)} м²</span>) </p>
              <p>Общая начальная стоимость составляет примерно: <span>${data.totalCost?.toLocaleString("de-DE")} MDL (&#8776; ${(data.totalCost / 19.5).toLocaleString("de-DE")} EUR)</span>.</p>
              <br/>
              <p>Примерная экономия в год: <span>${data.annualSavings?.toLocaleString("de-DE")} MDL (&#8776; ${(data.annualSavings / 19.5).toLocaleString("de-DE")} EUR)</span>.</p>
              <p>Окупаемость за <span>${data.paybackPeriod?.toFixed(2)} лет</span>.</p>
              <p>Площадь здания<span> &#8776; ${data.roofArea?.toFixed(2)}м²</span> </p>
              <p>Высота крыши <span>(угол склона &#8776; ${data.roofSlopeAngleDegrees} °)</span> </p>
              <p>По всем данным: клиент ${data.canInstallPanels ? "МОЖЕТ установить необходимое количество панелей." : "НЕ МОЖЕТ установить необходимое количество панелей."}.</p>
              <br/>
              <p>Если у вас возникнут вопросы или вам потребуется помощь, наша команда поддержки всегда готова помочь. Вы можете связаться с нами по адресу <a href="mailto:cavliuc.serv@gmail.com">cavliuc.serv@gmail.com</a> или посетить наш <a href="https://whatstheplan.com/support">раздел поддержки на сайте</a>.</p>
              <p>Мы надеемся, что наш сервис поможет вам более экономично управлять вашим бюджетом и быть более экологичным!</p>
            </div>
            <div class="footer">
              <p>С уважением,<br>Команда SolarEnergy</p>
              <p>Это письмо отправлено автоматически, пожалуйста, не отвечайте на него.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const mailForMe = {
      from: "SolarEnergy <no-reply@solarenergy.com>",
      to: "cavliuc.serv@gmail.com",
      subject: "Новый заинтересованный пользователь!",
      text: "",
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Новый заинтересованный пользователь!</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: rgba(208, 4, 103, 1);
            }
            .container {
              width: 500px;
              height: 900px;
              margin: 0 auto;
              padding: 20px;
              border-radius: 10px;
              background: white;
            }
            .header {
              text-align: center;
              background-color: rgba(255, 255, 255, 0.2);
              color: #fff;
              padding: 10px 0;
              border-radius: 10px 10px 0 0;
            }
            .content {
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 0.9em;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Новый заинтересованный пользователь!</h1>
            </div>
            <div class="content">
              <p>Имя: ${input.contact.name} ${input.contact.lastname}</p>
              <p>Email: ${input.contact.email}</p>
              <p>Телефон: ${input.contact.phone}</p>
              <br/>
              <p>Расчет на <span>${data.panelsNeeded} солнечных панелей.</span></p>
              <p>Общая площадь панелей: <span>${data.totalPanelArea?.toFixed(2)} м²</span></p>
              <p>Примерная экономия в год: <span>${data.annualSavings?.toLocaleString("de-DE")} MDL (&#8776; ${(data.annualSavings / 19.5).toLocaleString("de-DE")} EUR)</span>.</p>
              <p>Окупаемость за <span>${data.paybackPeriod?.toFixed(2)} лет</span>.</p>
              <p>Площадь здания: <span>${data.roofArea?.toFixed(2)} м²</span></p>
              <p>Высота крыши (угол склона): <span>${data.roofSlopeAngleDegrees} °</span></p>
              <p>По всем данным: клиент ${data.canInstallPanels ? "МОЖЕТ установить необходимое количество панелей." : "НЕ МОЖЕТ установить необходимое количество панелей."}</p>
            </div>
            <div class="footer">
              <p>С уважением,<br>Команда SolarEnergy</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(mailForMe),
    ]);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
