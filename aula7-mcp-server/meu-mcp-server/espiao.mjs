// espiao.mjs: fica no meio do cano entre o Claude Code e o seu server
// e anota tudo que passa num arquivo, o conversa.log.
//
// Você não precisa mexer aqui. Ele só existe pra você VER o protocolo.
// Uso: claude mcp add meu-mcp -- node /CAMINHO/ABSOLUTO/espiao.mjs
//
// Zero dependência: só módulos do próprio Node.

import { spawn } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const pasta = path.dirname(fileURLToPath(import.meta.url));
const log = path.join(pasta, "conversa.log");
const hora = () => new Date().toLocaleTimeString("pt-BR");

writeFileSync(log, `# conversa.log (${new Date().toLocaleString("pt-BR")})\n`);

function anota(direcao, pedaco, sobra) {
  // O protocolo manda uma mensagem JSON por linha. Remonta linha a linha.
  const texto = sobra.valor + pedaco.toString("utf8");
  const linhas = texto.split("\n");
  sobra.valor = linhas.pop();
  for (const linha of linhas) {
    if (!linha.trim()) continue;
    let bonito = linha;
    try {
      bonito = JSON.stringify(JSON.parse(linha), null, 2);
    } catch {
      bonito = `(ATENÇÃO: isso não é JSON e não devia estar no cano) ${linha}`;
    }
    appendFileSync(log, `\n[${hora()}] ${direcao}\n${bonito}\n`);
  }
}

const server = spawn(process.execPath, [path.join(pasta, "server.mjs")], {
  stdio: ["pipe", "pipe", "inherit"],
});

const doClaude = { valor: "" };
const doServer = { valor: "" };

process.stdin.on("data", (pedaco) => {
  anota("CLAUDE CODE -> SERVER", pedaco, doClaude);
  server.stdin.write(pedaco);
});
server.stdout.on("data", (pedaco) => {
  anota("SERVER -> CLAUDE CODE", pedaco, doServer);
  process.stdout.write(pedaco);
});

process.stdin.on("end", () => server.stdin.end());
server.on("exit", (codigo) => process.exit(codigo ?? 0));
