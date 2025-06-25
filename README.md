# 🤖 AI Chat Interface

A modern, ChatGPT-style AI chat interface built with Next.js, featuring the powerful LLaMA 3.3 70B model via Groq API. The interface combines beautiful glassmorphism design with a collapsible sidebar for an exceptional user experience.

## ✨ Features

### 🎨 **Modern UI/UX**
- **ChatGPT-style Layout**: Full-height chat interface with floating input
- **Glassmorphism Design**: Beautiful backdrop blur effects and transparency
- **Dark/Light Mode**: Automatic theme switching with seamless transitions
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Powered by Framer Motion for fluid interactions

### 🤖 **AI Capabilities**
- **LLaMA 3.3 70B Model**: Latest and most capable 70B model via Groq API
- **Markdown Support**: Full markdown rendering with syntax highlighting
- **Real-time Responses**: Fast inference with streaming-like experience
- **Message History**: Persistent conversation history during session

### 🎛️ **Interface Components**
- **Collapsible Sidebar**: Auto-expanding navigation with hover effects
- **Command Palette**: Quick access to features with `/` commands
- **File Attachments**: Support for file uploads (UI ready)
- **Mobile Menu**: Touch-friendly hamburger menu for mobile devices

### 🔧 **Technical Features**
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Shadcn/ui**: High-quality, accessible UI components
- **Groq API Integration**: Fast and reliable AI model inference

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **Groq API Key** - Get yours at [console.groq.com](https://console.groq.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Haqbani/propmting-ui.git
   cd propmting-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting a Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://console.groq.com/keys)
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## 📱 Usage

### Basic Chat
- Type your message in the input field at the bottom
- Press **Enter** to send (or **Shift+Enter** for new line)
- View AI responses with full markdown formatting

### Command Palette
- Type `/` to open the command palette
- Use arrow keys to navigate options
- Press **Tab** or **Enter** to select

### Sidebar Navigation
- **Desktop**: Hover over the sidebar to expand
- **Mobile**: Tap the hamburger menu icon
- Access chat history, settings, and account options

### Theme Toggle
- Click the theme toggle button in the top-right corner
- Automatically switches between light and dark modes
- Respects system preferences

## 🛠️ Built With

- **[Next.js](https://nextjs.org/)** - React framework for production
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library
- **[Shadcn/ui](https://ui.shadcn.com/)** - Re-usable components built with Radix UI
- **[Groq API](https://groq.com/)** - Fast AI inference platform
- **[React Markdown](https://github.com/remarkjs/react-markdown)** - Markdown rendering
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons

## 🎯 Key Components

### Chat Interface (`AnimatedAIChat`)
- Full-height chat layout with floating input
- Message rendering with markdown support
- Typing indicators and loading states
- Auto-scroll to latest messages

### Sidebar (`Sidebar`)
- Collapsible navigation with smooth animations
- Mobile-responsive with slide-out menu
- Quick access to chat history and settings

### Theme System
- CSS custom properties for consistent theming
- Automatic dark/light mode detection
- Smooth transitions between themes

## 🔧 Configuration

### Environment Variables
```env
GROQ_API_KEY=your_groq_api_key_here  # Required: Your Groq API key
```

### Model Configuration
The app uses LLaMA 3.3 70B by default. You can modify the model in `app/api/chat/route.ts`:

```typescript
model: 'llama-3.3-70b-versatile', // Change model here
temperature: 0.7,                 // Adjust creativity
max_tokens: 1024,                 // Response length limit
```

## 📦 Project Structure

```
ui/
├── app/
│   ├── api/chat/           # Chat API endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page with sidebar
├── components/ui/
│   ├── animated-ai-chat.tsx    # Main chat interface
│   ├── sidebar.tsx             # Collapsible sidebar
│   └── theme-toggle.tsx        # Dark/light mode toggle
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference
- **Shadcn** for the beautiful UI components
- **Vercel** for the Next.js framework
- **Tailwind Labs** for the CSS framework

## 📞 Support

If you have any questions or need help getting started:

1. Check the [Issues](https://github.com/Haqbani/propmting-ui/issues) page
2. Create a new issue if your question isn't answered
3. Join the discussion in the repository

---

**Built with ❤️ using Next.js and LLaMA 3.3 70B**
