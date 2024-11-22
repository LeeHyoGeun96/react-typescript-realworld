import {Link} from 'react-router-dom';

interface FooterProps {}

const Footer = ({}: FooterProps) => {
  return (
    <footer className="py-8 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <Link
            to="/"
            className="text-green-500 text-xl font-bold hover:text-green-600 transition-colors"
            aria-label="홈으로 이동"
          >
            conduit
          </Link>
          <p className="text-gray-600 text-sm text-center">
            An interactive learning project from{' '}
            <a
              href="https://thinkster.io"
              className="text-green-500 hover:text-green-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Thinkster 웹사이트로 이동"
            >
              Thinkster
            </a>
            . Code &amp; design licensed under MIT.
          </p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
