import puppeteer from "puppeteer";
import { writeFileSync } from "fs";
import express from "express";
import path from "path";

const app = express();
app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile(path.resolve("dist/index.html"));
});
app.use((req, res) => res.status(404).end());

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(
    `Starting custom prerender script with Puppeteer on port ${port}...`,
  );
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate and wait for DOM content loaded
    await page.goto(`http://localhost:${port}/`, {
      waitUntil: "domcontentloaded",
    });

    // Give React 3 seconds to render the landing page animations and states
    await new Promise((r) => setTimeout(r, 3000));

    // Extract HTML
    const html = await page.content();
    writeFileSync("dist/index.html", html);

    await browser.close();
    server.close();
    console.log("Prerendering completed.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    server.close();
    process.exit(1);
  }
});
