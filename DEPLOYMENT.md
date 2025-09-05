# EduConnect Deployment Guide

This guide will walk you through deploying EduConnect to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications.

#### Prerequisites
- GitHub account
- Vercel account
- All API keys and services set up

#### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

3. **Configure Environment Variables**
   
   In the Vercel dashboard, add these environment variables:

   ```env
   # Base MiniApp Configuration
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Neynar API Configuration
   NEYNAR_API_KEY=your_neynar_api_key

   # Privy Configuration
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   PRIVY_APP_SECRET=your_privy_app_secret

   # Application Configuration
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be available at `https://your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to your project settings in Vercel
   - Add your custom domain
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Option 2: Railway

Railway is another excellent option for full-stack applications.

#### Steps

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select your repository

2. **Configure Environment Variables**
   - Add all the same environment variables as listed above
   - Update `NEXT_PUBLIC_APP_URL` to your Railway domain

3. **Deploy**
   - Railway will automatically deploy your application
   - Your app will be available at your Railway domain

### Option 3: Netlify

Netlify is great for static sites and can handle Next.js applications.

#### Steps

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

2. **Configure Environment Variables**
   - Add all environment variables in Netlify dashboard
   - Update `NEXT_PUBLIC_APP_URL` to your Netlify domain

## 🔧 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] All API keys are set up and working
- [ ] `NEXT_PUBLIC_APP_URL` points to your production domain
- [ ] `NEXT_PUBLIC_ENVIRONMENT` is set to "production"

### 2. Database Setup
- [ ] Supabase database is set up with the schema
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Sample data is removed or appropriate for production

### 3. API Services
- [ ] Neynar API key is valid and has appropriate limits
- [ ] Privy app is configured for your production domain
- [ ] OnchainKit API key is valid
- [ ] Supabase project is in production mode

### 4. Code Quality
- [ ] All TypeScript errors are resolved
- [ ] Linting passes without errors
- [ ] Build completes successfully locally

### 5. Testing
- [ ] Authentication flow works
- [ ] Study group creation/joining works
- [ ] Help request system works
- [ ] Farcaster integration works

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different API keys for development and production
- Regularly rotate API keys

### Database Security
- Enable Row Level Security (RLS) on all tables
- Review and test all RLS policies
- Use the service role key only for server-side operations

### API Rate Limits
- Monitor API usage for all services
- Implement proper error handling for rate limits
- Consider caching strategies for frequently accessed data

## 📊 Monitoring and Analytics

### Error Monitoring
Consider adding error monitoring services:
- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay
- [Vercel Analytics](https://vercel.com/analytics) for performance monitoring

### Database Monitoring
- Monitor Supabase usage and performance
- Set up alerts for high usage or errors
- Regular database backups

### API Monitoring
- Monitor API response times and error rates
- Set up alerts for API failures
- Track usage against rate limits

## 🚀 Post-Deployment Steps

### 1. Domain Configuration
- Set up custom domain if desired
- Configure SSL certificate (usually automatic)
- Update `NEXT_PUBLIC_APP_URL` environment variable

### 2. Base MiniApp Registration
- Register your app with Base if required
- Update any Base-specific configurations
- Test MiniKit integration in production

### 3. Farcaster Integration
- Test Farcaster authentication in production
- Verify cast publishing works correctly
- Update any Farcaster-specific configurations

### 4. Performance Optimization
- Enable Vercel Analytics or similar
- Monitor Core Web Vitals
- Optimize images and assets as needed

### 5. SEO and Social
- Add proper meta tags
- Configure Open Graph images
- Set up social media sharing

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm run test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Check linting errors: `npm run lint`
   - Verify all dependencies are installed

2. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify API keys are valid

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies aren't blocking access
   - Ensure database schema is up to date

4. **Authentication Issues**
   - Verify Neynar API key is valid
   - Check Farcaster integration setup
   - Ensure Privy configuration is correct

5. **API Rate Limits**
   - Monitor API usage
   - Implement proper error handling
   - Consider upgrading API plans if needed

### Getting Help

If you encounter issues:
1. Check the application logs in your deployment platform
2. Review the browser console for client-side errors
3. Check Supabase logs for database issues
4. Verify all API services are operational

## 📈 Scaling Considerations

As your application grows, consider:

- **Database**: Upgrade Supabase plan for more connections and storage
- **API Limits**: Monitor and upgrade API service plans as needed
- **CDN**: Use Vercel's CDN or add Cloudflare for better performance
- **Caching**: Implement Redis caching for frequently accessed data
- **Load Balancing**: Consider multiple deployment regions

---

🎉 **Congratulations!** Your EduConnect app should now be live and ready for users to find their study squads!
