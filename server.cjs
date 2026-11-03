var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_nodemailer = __toESM(require("nodemailer"), 1);
var import_vite = require("vite");
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/contact", async (req, res) => {
    const { name, phone, treatment, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Numele \u0219i num\u0103rul de telefon sunt obligatorii."
      });
    }
    console.log(`[Contact Form Submis] Nume: ${name}, Telefon: ${phone}, Serviciu: ${treatment}`);
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL;
    const isSmtpConfigured = !!(smtpHost && smtpPort && smtpUser && smtpPass && receiverEmail);
    if (!isSmtpConfigured) {
      console.warn("\u26A0\uFE0F [SMTP Warning] Variabilele de mediu SMTP nu sunt complet configurate. Solicitarea a fost salvat\u0103 \xEEn consol\u0103.");
      return res.status(200).json({
        success: true,
        smtpConfigured: false,
        message: "Mesajul a fost salvat ca simulare! Pentru trimiterea real\u0103 prin email, te rug\u0103m s\u0103 adaugi creden\u021Bialele tale de SMTP \xEEn zona de Secrets / `.env`."
      });
    }
    try {
      const transporter = import_nodemailer.default.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort || "587", 10),
        secure: smtpPort === "465",
        // true for port 465, false for other ports
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      const servicesMap = {
        urgenta: "\u{1F534} Urgen\u021B\u0103 stomatologic\u0103 rapid\u0103",
        consultatie: "\u{1F4C5} Consulta\u021Bie & Plan de tratament",
        igienizare: "\u2728 Detartraj \u0219i igienizare",
        "tratament-canal": "\u{1F9B7} Tratament de canal / Extirpare",
        "coroane-proteze": "\u{1F451} Coroane / Proteze dentare",
        implant: "\u{1F50B} Implant stomatologic"
      };
      const selectedService = servicesMap[treatment] || treatment;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="background-color: #0f172a; padding: 24px; text-align: center; color: #ffffff;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">Cabinet Stomatologic \u0218tefan cel Mare</h2>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #38bdf8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Solicitare Nou\u0103 de Programare</p>
          </div>
          <div style="padding: 24px; background-color: #ffffff; color: #334155; line-height: 1.6;">
            <p style="margin-top: 0; font-size: 15px;">Bun\u0103 ziua,</p>
            <p style="font-size: 14px;">A\u021Bi primit o nou\u0103 solicitare de programare/contact de pe site-ul oficial:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%; color: #64748b;">Nume Complet</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Num\u0103r Telefon</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0284c7;">
                  <a href="tel:${phone}" style="color: #0284c7; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Serviciu Solicitat</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${selectedService}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; vertical-align: top;">Mesaj / Simptome</td>
                <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; color: #334155; font-style: italic;">"${message || "F\u0103r\u0103 detalii suplimentare"}"</td>
              </tr>
            </table>

            <div style="background-color: #f8fafc; padding: 12px 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
              V\u0103 rug\u0103m s\u0103 contacta\u021Bi pacientul la num\u0103rul indicat \xEEn cel mai scurt timp posibil.
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            Trimis automat din sistemul site-ului cabinetului stomatologic \u0218tefan cel Mare.
          </div>
        </div>
      `;
      await transporter.sendMail({
        from: `"${name} - Solicitare Clinic\u0103" <${smtpUser}>`,
        to: receiverEmail,
        replyTo: smtpUser,
        subject: `[Programare] ${name} - ${selectedService}`,
        html: htmlContent
      });
      console.log(`\u2705 [Email Succeeded] Email trimis de la ${name} c\u0103tre ${receiverEmail}`);
      return res.status(200).json({ success: true, smtpConfigured: true });
    } catch (error) {
      console.error("\u274C [Email Error] Eroare la trimiterea emailului prin SMTP:", error);
      return res.status(500).json({
        success: false,
        message: "A ap\u0103rut o eroare la conectarea cu serverul de email SMTP. Te rug\u0103m s\u0103 verifici corectitudinea datelor introduse.",
        error: error.message
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
