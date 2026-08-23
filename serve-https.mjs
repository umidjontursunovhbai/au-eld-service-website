import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:https";
import { dirname, extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const certificateDirectory = join(projectRoot, ".certs");
const certificatePath = join(certificateDirectory, "localhost.pem");
const privateKeyPath = join(certificateDirectory, "localhost-key.pem");
const port = Number.parseInt(process.env.PORT ?? "4174", 10);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".gif", "image/gif"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function ensureDevelopmentCertificate() {
  if (existsSync(certificatePath) && existsSync(privateKeyPath)) return;

  mkdirSync(certificateDirectory, { recursive: true });
  const result = spawnSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-sha256",
      "-days",
      "825",
      "-nodes",
      "-keyout",
      privateKeyPath,
      "-out",
      certificatePath,
      "-subj",
      "/CN=localhost/O=AU ELD Local Development",
      "-addext",
      "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1",
      "-addext",
      "keyUsage=digitalSignature,keyEncipherment",
      "-addext",
      "extendedKeyUsage=serverAuth",
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0) {
    const details = result.stderr?.trim() || "OpenSSL did not create a certificate.";
    throw new Error(`Unable to create the local HTTPS certificate: ${details}`);
  }
}

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "https://localhost").pathname);
  const relativePath = normalize(pathname).replace(/^[/\\]+/, "");
  const candidatePath = resolve(projectRoot, relativePath || "index.html");
  const allowedPrefix = `${projectRoot}${sep}`;

  if (candidatePath !== projectRoot && !candidatePath.startsWith(allowedPrefix)) {
    return null;
  }

  try {
    return statSync(candidatePath).isDirectory() ? join(candidatePath, "index.html") : candidatePath;
  } catch {
    return candidatePath;
  }
}

ensureDevelopmentCertificate();

const server = createServer(
  {
    cert: readFileSync(certificatePath),
    key: readFileSync(privateKeyPath),
    minVersion: "TLSv1.2",
  },
  (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end("Method Not Allowed");
      return;
    }

    const filePath = resolveRequestPath(request.url ?? "/");
    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    const contentType = mimeTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentType,
      "Strict-Transport-Security": "max-age=0",
      "X-Content-Type-Options": "nosniff",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(readFileSync(filePath));
  },
);

server.listen(port, "127.0.0.1", () => {
  console.log(`AU ELD HTTPS preview: https://localhost:${port}`);
  console.log("Local certificate: .certs/localhost.pem");
});
