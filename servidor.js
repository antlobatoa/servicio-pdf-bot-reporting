const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json({ limit: "5mb" }));

app.get("/salud", (req, res) => {
  res.json({ estado: "ok" });
});

function exigirClave(req, res, next) {
  const clave = process.env.CLAVE_SERVICIO;
  if (!clave) {
    return res.status(500).json({ error: "Servicio sin configurar" });
  }
  if (req.get("x-api-key") !== clave) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

app.post("/pdf", exigirClave, async (req, res) => {
  const html = req.body && req.body.html;
  if (typeof html !== "string" || html.trim() === "") {
    return res.status(400).json({ error: "Falta el campo 'html' (texto)" });
  }

  let navegador;
  try {
    navegador = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const pagina = await navegador.newPage();
    await pagina.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await pagina.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });
    res.set("Content-Type", "application/pdf");
    res.send(Buffer.from(pdf));
  } catch (error) {
    console.error("Error generando el PDF:", error.message);
    res.status(500).json({ error: "No se pudo generar el PDF" });
  } finally {
    if (navegador) await navegador.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servicio PDF escuchando en el puerto ${PORT}`);
});
