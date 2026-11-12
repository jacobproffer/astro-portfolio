// Pull each project's og:image (falling back to twitter:image) and save it as
// that project's thumbnail, normalised to 1200×630 JPEG.
//
//   npm run thumbnails              # every project
//   npm run thumbnails -- airports  # only the named project file(s)
//
// The output path comes from each project's `thumbnail` frontmatter, so
// existing images are overwritten in place.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const USER_AGENT = "Mozilla/5.0 (compatible; portfolio-thumbnails/1.0)";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const projectsDir = join(root, "src/content/projects");
const only = new Set(process.argv.slice(2));

const frontmatterValue = (source, key) =>
  source.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)["']?\\s*$`, "m"))?.[1];

const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#47;/g, "/");

function findMetaImage(html, pageUrl) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of ["og:image", "og:image:url", "twitter:image"]) {
    for (const tag of tags) {
      const name = tag.match(/\b(?:property|name)\s*=\s*["']?([^"'\s>]+)/i)?.[1];
      if (name?.toLowerCase() !== key) continue;
      const content = tag.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const value = content?.[1] ?? content?.[2] ?? content?.[3];
      if (value) return new URL(decode(value), pageUrl).href;
    }
  }
  return null;
}

async function fetchOk(url) {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT },
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res;
}

const files = (await readdir(projectsDir))
  .filter((file) => file.endsWith(".md"))
  .filter((file) => only.size === 0 || only.has(file.replace(/\.md$/, "")));

let failures = 0;

for (const file of files) {
  const path = join(projectsDir, file);
  const source = await readFile(path, "utf8");
  const pageUrl = frontmatterValue(source, "url");
  const thumbnail = frontmatterValue(source, "thumbnail");

  try {
    if (!pageUrl || !thumbnail) throw new Error("missing url or thumbnail");

    const html = await (await fetchOk(pageUrl)).text();
    const imageUrl = findMetaImage(html, pageUrl);
    if (!imageUrl) throw new Error(`no og:image on ${pageUrl}`);

    const image = Buffer.from(await (await fetchOk(imageUrl)).arrayBuffer());
    const output = resolve(dirname(path), thumbnail);
    const jpeg = await sharp(image)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    await writeFile(output, jpeg);

    const offSite = new URL(imageUrl).host !== new URL(pageUrl).host;
    console.log(
      `✓ ${file} ← ${imageUrl}${offSite ? "  (note: image is hosted on a different domain)" : ""}`,
    );
  } catch (error) {
    failures++;
    console.error(`✗ ${file}: ${error.message}`);
  }
}

if (failures) process.exitCode = 1;
