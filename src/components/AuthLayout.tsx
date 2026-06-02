import { Link } from 'react-router-dom';
import Logo from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  altText: string;
  altLinkText: string;
  altLinkTo: string;
}

export default function AuthLayout({ children, altText, altLinkText, altLinkTo }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5">
        <Link to="/" className="flex items-center no-underline">
          <Logo size={40} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">{altText}</span>
          <Link
            to={altLinkTo}
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors no-underline"
          >
            {altLinkText}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center pt-16 sm:pt-24 px-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
