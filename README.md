# REIGN NEW YORK - Membership Approval System

A modern, responsive web application for displaying membership approval cards with integrated payment functionality.

## 🚀 Features

- **Responsive Design**: Fully responsive layout that works on all devices (mobile, tablet, desktop)
- **Dynamic Member Data**: Parse member information from URL parameters
- **Roman Numeral Conversion**: Automatically converts Roman numerals to Arabic numbers
- **Payment Integration**: Direct links to payment systems
- **Professional UI**: Clean, elegant design with custom styling
- **TypeScript**: Full TypeScript support for better development experience

## 📋 URL Parameters

The application accepts the following URL parameters:

| Parameter | Description                      | Example                               | Required    |
| --------- | -------------------------------- | ------------------------------------- | ----------- |
| `member`  | `firstname_lastname_RomanNumber` | `John_Smith_IV`                       | ✅ Yes      |
| `price`   | Annual membership dues           | `500`                                 | ✅ Yes      |
| `link`    | Payment URL                      | `https://payment.example.com/pay/123` | ❌ Optional |

### Example URLs

```
http://localhost:3000/?member=John_Smith_IV&price=500&link=https://payment.example.com/pay/123
http://localhost:3000/?member=Mary_Jane_Doe_XII&price=750&link=https://stripe.com/checkout/session_abc123
http://localhost:3000/?member=Alexander_Von_Humboldt_III&price=1000&link=https://paypal.com/payment/xyz789
```

## 🛠️ Technology Stack

- **Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: SVG images
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
client/
├── pages/
│   ├── _app.tsx          # App configuration
│   └── index.tsx         # Main membership approval page
├── public/
│   └── imgs/
│       ├── brand.svg     # Brand logo
│       └── logo.svg      # Main logo
├── styles/
│   └── globals.css       # Global styles
├── types/
│   └── index.ts          # TypeScript type definitions
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── next.config.js        # Next.js configuration
```

## 🎨 Customization

### Colors

The application uses a custom color scheme:

- **Background**: `#e6ceb1` (Light beige)
- **Card Background**: `#452005` (Dark brown)
- **Text**: `#452005` (Dark brown) and `#e6ceb1` (Light beige)

### Fonts

- **Serif**: Palatino Linotype, Book Antiqua, Palatino
- **Sans-serif**: System fonts

### Responsive Breakpoints

- **Mobile**: Default (up to 640px)
- **Small**: 640px+
- **Medium**: 768px+
- **Large**: 1024px+
- **Extra Large**: 1280px+

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (server mode)
npm run start        # Start production server
npm run build:static # Build for static export
npm run serve:static # Serve static export locally
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Environment Variables

Create a `.env.local` file for environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 Responsive Features

- **Mobile-first design** with progressive enhancement
- **Flexible card sizing** that adapts to screen size
- **Responsive typography** that scales appropriately
- **Touch-friendly buttons** with proper sizing
- **Optimized images** with Next.js Image component

## 🔒 Security Features

- **URL parameter validation** and error handling
- **Secure external links** with `rel="noopener noreferrer"`
- **Input sanitization** for member data
- **TypeScript type safety** throughout the application

## 🚀 Deployment

### Option 1: Server Mode (Recommended for Vercel)

1. **Build and start normally:**

   ```bash
   npm run build
   npm run start
   ```

2. **Deploy to Vercel:**
   - Push your code to GitHub
   - Connect your repository to Vercel
   - Deploy automatically

### Option 2: Static Export (For CDN/Static Hosting)

1. **Enable static export:**

   - Uncomment `output: 'export'` in `next.config.js`
   - Comment out the line again after building

2. **Build static files:**

   ```bash
   npm run build:static
   npm run serve:static
   ```

3. **Deploy static files:**
   - Upload the `out/` folder to any static hosting service
   - Works with: Netlify, GitHub Pages, AWS S3, etc.

### Deployment Platforms

**Server Mode:**

- Vercel (recommended)
- Railway
- DigitalOcean App Platform
- AWS Amplify

**Static Export:**

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN/Static hosting

## 📄 License

This project is proprietary software for REIGN NEW YORK.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**REIGN NEW YORK** - Premium Membership Experience
