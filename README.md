# F1 Radio Meme

A fun little app to generate f1 radio messages. Can be found at https://www.f1radiomeme.com

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment on Vercel

This project is configured to deploy on Vercel using the SvelteKit adapter.

### Prerequisites

- A Vercel account
- The project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

2. **Configure build settings:**
   - Framework Preset: SvelteKit (auto-detected)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.svelte-kit/vercel/output` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Manual Deployment

You can also deploy manually using the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Project Structure

- `src/routes/` - SvelteKit routes
- `src/lib/components/` - Reusable components
- `src/lib/renderers/` - Radio box renderers for different seasons
- `src/lib/seasons/` - Driver and team data
- `static/` - Static assets (fonts, images)
- `i18n/` - Internationalization files
