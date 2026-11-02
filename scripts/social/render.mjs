// Render social-image.html to public/images/social.jpg at exactly 1200×630.
// Drives headless Chrome over the DevTools protocol so the viewport size is
// exact (window-size flags include browser chrome). Override CHROME if needed.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9334;
const WIDTH = 1200;
const HEIGHT = 630;

const here = fileURLToPath(new URL(".", import.meta.url));
const template = pathToFileURL(join(here, "social-image.html")).href;
const output = join(here, "../../public/images/social.jpg");
const profile = mkdtempSync(join(tmpdir(), "social-image-"));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--allow-file-access-from-files",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  let page;
  for (let attempt = 0; attempt < 40 && !page; attempt++) {
    await sleep(250);
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      page = targets.find((target) => target.type === "page");
    } catch {
      // Chrome is still starting.
    }
  }
  if (!page) throw new Error("Could not connect to headless Chrome");

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve) => (socket.onopen = resolve));

  let id = 0;
  const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    pending.get(message.id)?.(message.result);
    pending.delete(message.id);
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      pending.set(++id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: template });
  await sleep(500);
  await send("Runtime.evaluate", {
    expression: "document.fonts.ready.then(() => true)",
    awaitPromise: true,
  });

  const { data } = await send("Page.captureScreenshot", {
    format: "jpeg",
    quality: 90,
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 },
  });
  writeFileSync(output, Buffer.from(data, "base64"));
  console.log(`Saved ${output}`);
  socket.close();
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(profile, { recursive: true, force: true });
}
