import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "dist");
const client = resolve(output, "client");
const server = resolve(output, "server");

await rm(output, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });

for (const file of ["index.html", "app.js", "styles.css"]) {
  await cp(resolve(root, file), resolve(client, file));
}

await writeFile(resolve(server, "index.js"), `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`);

console.log("Cloudline build ready in dist/");
