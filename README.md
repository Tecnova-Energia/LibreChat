# Nova — LibreChat Wrapper

Wrapper mínimo da imagem oficial do LibreChat para deploy no Railway.

## Como funciona

Este repositório não contém o código-fonte do LibreChat. Ele usa diretamente a imagem Docker oficial:

```
ghcr.io/danny-avila/librechat:latest
```

Toda a customização é feita via variáveis de ambiente e `librechat.yaml` configurado no Railway.

---

## Setup no Railway

### 1. Novo projeto

No [Railway](https://railway.app), crie um novo projeto a partir deste repositório GitHub.

### 2. Variáveis de ambiente obrigatórias

Configure as seguintes variáveis no painel do Railway:

| Variável | Descrição |
|---|---|
| `MONGO_URI` | URI do MongoDB Atlas |
| `JWT_SECRET` | Segredo JWT (string aleatória longa) |
| `JWT_REFRESH_SECRET` | Segredo JWT para refresh tokens |
| `CREDS_KEY` | Chave de criptografia de credenciais (32 chars hex) |
| `CREDS_IV` | IV de criptografia (16 chars hex) |
| `OPENAI_API_KEY` | Chave da API OpenAI |
| `DOMAIN_CLIENT` | URL pública do frontend (ex: `https://nova.up.railway.app`) |
| `DOMAIN_SERVER` | URL pública do backend (mesma que acima) |

### 3. Configuração via librechat.yaml

Faça upload do arquivo `librechat.yaml` pelo file browser do Railway e configure:

```yaml
version: 1.1.7

interface:
  appTitle: "Nova"

modelSpecs:
  enforce: true
  list:
    - name: "Nova"
      label: "Nova"
      # ... sua configuração aqui
```

### 4. Serviços adicionais

Adicione os seguintes serviços ao projeto Railway:

- **MongoDB** (ou use Atlas externo)
- **Redis** — necessário para sessões e cache

Configure `REDIS_URI` com a URL do serviço Redis do Railway.

### 5. Deploy

O Railway detecta o `Dockerfile` automaticamente e faz o build + deploy.

---

## Atualizar a imagem

Para usar uma versão específica do LibreChat, edite o `Dockerfile`:

```dockerfile
FROM ghcr.io/danny-avila/librechat:v0.7.9
```

Versões disponíveis: https://github.com/danny-avila/LibreChat/pkgs/container/librechat

---

## Suporte

- Documentação oficial: https://www.librechat.ai/docs
- Issues: https://github.com/danny-avila/LibreChat/issues
