# Next.js Monorepo with Sanity CMS

A modern, full-stack monorepo website built with Next.js App Router, Sanity CMS, Shadcn UI, and TurboRepo.

## Features

### Monorepo Structure

- Apps: web (Next.js frontend) and studio (Sanity Studio)
- Shared packages: UI components, TypeScript config, environment utilities, logger
- Turborepo for build orchestration and caching

### Frontend (Web)

- Next.js App Router with TypeScript
- Shadcn UI components with Tailwind CSS
- Server Components and Server Actions
- SEO optimization with metadata
- Blog system with rich text editor
- Table of contents generation
- Responsive layouts

### Content Management (Studio)

- Sanity Studio v5
- Custom document types (Blog, FAQ, Pages)
- Visual editing integration
- Structured content with schemas
- Live preview capabilities
- Asset management

## Getting Started

### 1. Extending the Sanity schema

The schemas for all document types are defined in the `studio/schemaTypes/documents` directory. You can [add more document types](https://www.sanity.io/docs/schema-types) to the schema to suit your needs.

### 2. Deploy Sanity Studio

> **⚠️ Important**: When initializing the template with the Sanity CLI, the `.github` folder may not be included or might be renamed to `github` (without the dot). If you don't see a `.github` folder in your project root, you'll need to manually create it and copy the GitHub Actions workflows from the [template repository](https://github.com/robotostudio/turbo-start-sanity/tree/main/.github) for the deployment automation to work.

The template includes a GitHub Actions workflow [`deploy-sanity.yml`](https://raw.githubusercontent.com/robotostudio/turbo-start-sanity/main/.github/workflows/deploy-sanity.yml) that automatically deploys your Sanity Studio whenever changes are pushed to the `studio` directory.

> **Note**: To use the GitHub Actions workflow, make sure to configure the following secrets in your repository settings:
>
> - `SANITY_DEPLOY_TOKEN`
> - `SANITY_STUDIO_PROJECT_ID`
> - `SANITY_STUDIO_DATASET`
> - `SANITY_STUDIO_TITLE`
> - `SANITY_STUDIO_PRESENTATION_URL`
> - `SANITY_STUDIO_PRODUCTION_HOSTNAME`

Set `SANITY_STUDIO_PRODUCTION_HOSTNAME` to whatever you want your deployed Sanity Studio hostname to be. Eg. for `SANITY_STUDIO_PRODUCTION_HOSTNAME=my-cool-project` you'll get a studio URL of `https://my-cool-project.sanity.studio` (and `<my-branch-name>-my-cool-project.sanity.studio` for PR previews builds done automatically via the `deploy-sanity.yml` github CI workflow when you open a PR.)

Set `SANITY_STUDIO_PRESENTATION_URL` to your web app front-end URL (from the Vercel deployment). This URL is required for production deployments and should be:

- Set in your GitHub repository secrets for CI/CD deployments
- Set in your local environment if deploying manually with `npx sanity deploy`
- Not needed for local development, where preview will automatically use `http://localhost:3000`

You can then manually deploy from your Studio directory (`/studio`) using:

```shell
npx sanity deploy
```

**Note**: To use the live preview feature, your browser needs to enable third party cookies.

### 3. Deploy Next.js app to Vercel

You have the freedom to deploy your Next.js app to your hosting provider of choice. With Vercel and GitHub being a popular choice, we'll cover the basics of that approach.

1. Create a GitHub repository from this project. [Learn more](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
2. Create a new Vercel project and connect it to your Github repository.
3. Set the `Root Directory` to your Next.js app (`/apps/web`).
4. Configure your Environment Variables.

### 4. Configure CORS Origins

Your production URLs must be added to your Sanity project's CORS origins, otherwise the frontend will be blocked from fetching content.

1. Go to [Sanity Manage](https://www.sanity.io/manage), select your project, and navigate to **API** > **CORS origins**.
2. Add the following origins:
   - Your production URL (e.g. `https://your-app.vercel.app`)
   - Your custom domain if applicable (e.g. `https://yourdomain.com`)
   - `http://localhost:3000` (for local development — added by default)
3. Enable **Allow credentials** for each origin that needs authenticated requests (e.g. live preview, visual editing).

> **Note**: Vercel preview deployments use unique URLs per commit. If you need CORS access on preview deployments, add a wildcard origin like `https://*-your-project.vercel.app` or add specific preview URLs as needed.

### 5. Invite a collaborator

Now that you've deployed your Next.js application and Sanity Studio, you can optionally invite a collaborator to your Studio. Open up [Manage](https://www.sanity.io/manage), select your project and click "Invite project members"

They will be able to access the deployed Studio, where you can collaborate together on creating content.
