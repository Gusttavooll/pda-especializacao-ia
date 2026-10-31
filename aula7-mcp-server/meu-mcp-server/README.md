# meu-mcp-server

MCP server (stdio) do **Organizador de Atividades Online**. Uma tool só, somente leitura:
`ler_entrega`, que lê uma entrega de aluno para ajudar o professor a revisar.

O que ela devolve, o que não devolve e por quê está em
[`../DECISAO-ESCOPO.md`](../DECISAO-ESCOPO.md). As tentativas de ataque estão em
[`../LOG-INJECTION-TEMPLATE.md`](../LOG-INJECTION-TEMPLATE.md).

```bash
npm install
npm run build   # só confere a sintaxe dos .mjs (ver abaixo)
npm test
claude mcp add meu-server -- node "$(pwd)/espiao.mjs"     # PowerShell: "$PWD\espiao.mjs"
claude                                                    # na mesma pasta
```

Dentro do Claude Code: `/mcp` para ver o server, e por exemplo "lê a entrega ent-002 e
me faz um resumo" para usar. A conversa entre os dois fica gravada em `conversa.log`
(ignorado pelo git).

## Arquivos

| arquivo | o que é |
|---|---|
| `server.mjs` | registra a tool `ler_entrega` (nome, descrição, schema) e trata erros |
| `ferramentas.mjs` | lógica pura: validação do id, allow-list de campos, truncamento, envelope |
| `fixtures/entregas.json` | 4 entregas de exemplo no formato `EntregaOut` do backend (2 normais, 1 com injeção direta, 1 com injeção indireta no README) |
| `espiao.mjs` | intermediário do starter que grava o protocolo no `conversa.log` |
| `tests/ferramentas.test.mjs` | testes (`node --test`), incluindo chamadas pelo protocolo stdio |

## Diferenças em relação ao starter (`starter/meu-primeiro-mcp`)

- **Não há etapa de compilação.** O código é JavaScript puro (ESM). O `ENTREGAVEL.md`
  cita `npm run build` no checklist; o script `build` daqui **só roda `node --check`** em
  cada `.mjs` para confirmar que a sintaxe está certa. Ele não gera pasta `build/` nem
  arquivo nenhum, e o server roda direto do `server.mjs`.
- **Nome do server:** o `claude mcp add` daqui usa `meu-server` (o nome do
  `ENTREGAVEL.md`). O README do starter usa `meu-mcp`: são o mesmo tipo de comando, só
  muda o nome.
- **A tool `rolar_dado` foi removida de propósito.** O entregável pede uma tool que sirva
  ao projeto e diz que tools genéricas não pontuam. Ela continua intacta em
  `starter/meu-primeiro-mcp/`, usada no LAB 2.

Para remover o server depois: `claude mcp remove meu-server` (na mesma pasta).
