# Universal Dragon / NOVA - Deployment Guide

This guide explains how to deploy the Universal Dragon application to a production environment.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Google Cloud project with Gemini API enabled (for Gemini models)
- An OpenAI API key (if using OpenAI models)
- A server or hosting platform (e.g., Google Cloud Run, Heroku, Vercel, Render)

## Environment Variables

Before deploying, ensure you have the following environment variables configured in your hosting environment:

- `GEMINI_API_KEY`: Your Google Gemini API key (Required for default chat and vision features).
- `OPENAI_API_KEY`: Your OpenAI API key (Optional, if you want to use OpenAI models).
- `ALLOWED_ORIGIN`: The URL of your deployed frontend (e.g., `https://your-app.com`). Set to `*` for testing, but restrict it in production.
- `PORT`: The port your server will run on (usually provided by the hosting platform, defaults to 3000).

## Build Process

The application is a full-stack app with a Vite React frontend and an Express backend. The build process compiles the frontend into static files and serves them via the Express backend.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Build the Application:**
    ```bash
    npm run build
    ```
    This command will build the Vite frontend and place the static files in the `dist` directory.

## Running in Production

To start the server in production mode, use the following command:

```bash
npm start
```

This will start the Express server (defined in `server.ts`), which will serve the API routes and the static frontend files from the `dist` directory.

## Deployment Options

### 1. Google Cloud Run (Recommended)

Google Cloud Run is an excellent choice for deploying containerized applications.

1.  **Create a `Dockerfile`** in the root of your project:
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    EXPOSE 3000
    CMD ["npm", "start"]
    ```
2.  **Build and Deploy:** Use the Google Cloud CLI to build and deploy your container.
    ```bash
    gcloud run deploy universal-dragon --source . --port 3000 --allow-unauthenticated
    ```
3.  **Set Environment Variables:** Configure your API keys in the Cloud Run service settings.

### 2. Render / Heroku

These platforms can automatically build and deploy your application from a GitHub repository.

1.  Connect your repository to the platform.
2.  Set the **Build Command** to `npm install && npm run build`.
3.  Set the **Start Command** to `npm start`.
4.  Add your environment variables in the platform's dashboard.

### 3. Vercel (Frontend Only / Serverless)

If you prefer to deploy the frontend to Vercel, you will need to adapt the backend routes into Vercel Serverless Functions (inside an `api` directory) or host the Express backend separately. The current setup is optimized for a single unified deployment (like Cloud Run or Render).

## Security Considerations

- **API Keys:** Never commit your `.env` file or expose your API keys in the frontend code. The current architecture securely handles API requests through the backend.
- **CORS:** Ensure the `ALLOWED_ORIGIN` environment variable is set to your actual domain to prevent unauthorized access to your API.
- **Rate Limiting:** Consider adding a rate-limiting middleware (like `express-rate-limit`) to your Express server to protect against abuse.

## Troubleshooting

- **"Backend API Error" or "Failed to fetch":** Check your server logs. Ensure your environment variables are set correctly and that your server is running.
- **Images/Video not generating:** These features require the user to input their own API key via the configuration modal in the UI, as they use paid models (`gemini-3.1-flash-image-preview`, `veo-3.1-fast-generate-preview`).
- **Ollama not connecting:** Ollama runs locally. If your app is deployed to the cloud, it will not be able to connect to a local Ollama instance unless you expose it securely (e.g., via ngrok) and update the Ollama URL in the app settings.
