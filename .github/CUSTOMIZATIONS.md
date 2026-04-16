# Customizações do Fork — Tecnova (Nova)

Este documento registra todas as modificações feitas nos arquivos do upstream
(danny-avila/LibreChat) para o fork da Tecnova. Consulte este arquivo ao
resolver conflitos de merge com o upstream.

---

## Regra geral

Toda customização segue o padrão: **absorver a lógica nova do upstream +
reintroduzir nossa modificação**. Nunca descartar a versão do upstream.

---

## 1. File picker — suporte a Excel e documentos

**Problema resolvido:** o diálogo de upload só mostrava PDF e imagens para o
endpoint OpenAI, ignorando os `supportedMimeTypes` configurados no yaml.

### `packages/data-provider/src/file-config.ts`

**O que fizemos:** adicionamos a constante `openaiDocumentExtensions` logo após
`bedrockDocumentExtensions`.

```ts
/** File extensions accepted by OpenAI/standard document uploads (for input accept attributes) */
export const openaiDocumentExtensions =
  '.pdf,.csv,.doc,.docx,.xls,.xlsx,.pptx,.txt,application/pdf,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain';
```

**Como resolver conflito:** manter a versão do upstream + reinserir o bloco
acima logo após o export de `bedrockDocumentExtensions`.

---

### `client/src/components/Chat/Input/Files/AttachFileMenu.tsx`

**O que fizemos:** substituímos os `accept` hardcoded dos casos `document`,
`image_document` e `image_document_video_audio` para usar `openaiDocumentExtensions`.

```ts
// Importar junto com bedrockDocumentExtensions:
import {
  openaiDocumentExtensions,
  bedrockDocumentExtensions,
  // ...demais imports
} from 'librechat-data-provider';

// Casos no handleUploadClick:
} else if (fileType === 'document') {
  inputRef.current.accept = openaiDocumentExtensions;
} else if (fileType === 'image_document') {
  inputRef.current.accept = `image/*,.heif,.heic,${openaiDocumentExtensions}`;
} else if (fileType === 'image_document_video_audio') {
  inputRef.current.accept = `image/*,.heif,.heic,${openaiDocumentExtensions},video/*,audio/*`;
```

**Como resolver conflito:** manter a lógica nova do upstream no
`handleUploadClick` + garantir que os três casos acima usam
`openaiDocumentExtensions` em vez de `.pdf,application/pdf` hardcoded.

---

## 2. Responses API — Excel bloqueado antes de enviar à OpenAI

**Problema resolvido:** ao enviar um arquivo Excel (.xlsx) no chat com GPT-5.4
(que usa a Responses API), a OpenAI retornava erro 400 porque a Responses API
só aceita `application/pdf` no formato `file_data`. O LibreChat enviava Excel
como base64 sem validar o tipo.

### `packages/api/src/files/encode/document.ts`

**O que fizemos:** adicionamos verificação de MIME type no `formatDocumentBlock`
para quando `useResponsesApi` é `true` — qualquer tipo que não seja PDF retorna
`null` (arquivo ignorado silenciosamente, sem crash).

```ts
if (useResponsesApi) {
  if (mimeType !== 'application/pdf') {
    return null;
  }
  return {
    type: 'input_file',
    filename: resolvedFilename,
    file_data: `data:${mimeType};base64,${content}`,
  };
}
```

**Como resolver conflito:** manter a versão do upstream do bloco `if (useResponsesApi)`
+ reinserir o `if (mimeType !== 'application/pdf') { return null; }` antes do `return`.

> **Nota:** Excel e outros formatos de documento funcionam via agentes com a
> tool `file_search` — esse bloqueio só afeta o chat direto com modelos que
> usam a Responses API (ex: GPT-5.4).

---

## 3. Workflows GitNexus — silenciados no fork

**Problema resolvido:** os workflows do GitNexus (infraestrutura interna do
upstream no DigitalOcean) disparavam no fork da Tecnova a cada sync,
falhando por falta de credenciais e gerando notificações de e-mail.

**Guard adicionado em todos os jobs dos 4 workflows:**

```yaml
if: github.repository == 'danny-avila/LibreChat' && (
  # ... condição original do upstream ...
)
```

### Arquivos afetados

| Arquivo | Job | Posição do guard |
|---|---|---|
| `.github/workflows/gitnexus-deploy-do.yml` | `build-image` | Envolvendo condição existente com `&&` |
| `.github/workflows/gitnexus-deploy-do.yml` | `deploy` | Novo `if:` adicionado |
| `.github/workflows/gitnexus-cleanup-pr.yml` | `cleanup` | Prefixando condição existente com `&&` |
| `.github/workflows/gitnexus-index.yml` | `index` | Envolvendo condição existente com `&&` |
| `.github/workflows/gitnexus-pr-command.yml` | `dispatch` | Prefixando condição existente com `&&` |

**Como resolver conflito (padrão para todos):**

1. Pegar a versão nova do upstream para o bloco `if:`
2. Envolver com o guard do repositório:

```yaml
if: |
  github.repository == 'danny-avila/LibreChat' && (
    # colar aqui a condição nova do upstream
  )
```

> **Atenção:** o upstream renomeou `gitnexus-deploy-do.yml` para
> `gitnexus-deploy.yml` em abril/2026. Verificar se o arquivo ainda existe
> com esse nome após futuros syncs.

---

## Configuração da Nova (fora do repositório)

O `librechat.yaml` com as configurações da Nova (modelSpecs, fileConfig,
interface, termos de uso, etc.) está no **volume do FileBrowser no Railway**,
não versionado neste repositório. Portanto, não há risco de conflito de merge
para essas configurações.
