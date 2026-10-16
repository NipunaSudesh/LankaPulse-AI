
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'LankaPulse AI',
    template: '%s | LankaPulse AI',
  },
  description:
    'Explore Sri Lankan news from multiple sources with AI-powered news classification, summaries, and insights across business, economy, politics, crime, technology, and public affairs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Providers>
          <Navbar />
          {children}
           <Footer />
        </Providers>
      </body>
    </html>
  );
}
