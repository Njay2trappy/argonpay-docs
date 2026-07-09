# Argonpay Docs

Standalone developer documentation site for [Argonpay](https://argonpay.app), served at [docs.argonpay.app](https://docs.argonpay.app).

## Stack

- Next.js 13 (Pages Router)
- React 18
- Docker + Traefik (production)

## Local development

```bash
npm install
npm run dev
```

App runs on [http://localhost:3002](http://localhost:3002).

## Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_URL` | Argonpay API base URL (Try It proxy) | `https://api.argonpay.app` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | Main marketing site | `https://argonpay.app` |

## Docker

```bash
docker build -t argonpay-docs .
docker run --rm -p 3002:3002 \
  -e BACKEND_URL=https://api.argonpay.app \
  -e NEXT_PUBLIC_MAIN_SITE_URL=https://argonpay.app \
  argonpay-docs
```

## Production

Deployed on the VPS via `/root/docker-compose.yml` as the `argonpay-docs` service, routed by Traefik to `docs.argonpay.app`.
