import {Link, NavLink} from 'react-router-dom';
import {useBoundStore} from '../store';
import {useEffect} from 'react';

interface HeaderProps {}

interface NavLinksProps {
  isLoggedIn: boolean;
  user: any; // TODO: 실제 user 타입으로 변경
}

const Header = ({}: HeaderProps) => {
  const isLoggedIn = useBoundStore((state) => state.isLoggedIn);
  const user = useBoundStore((state) => state.user);

  useEffect(() => {
    const mobileHeader = document.getElementById('mobile-header');

    const handleScroll = () => {
      if (!mobileHeader) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = document.documentElement.clientHeight;

      // 스크롤이 바닥에 닿았는지 확인
      const isScrollBottom = scrollHeight - scrollTop <= clientHeight + 1;

      if (isScrollBottom) {
        mobileHeader.style.transition = 'all 0.2s ease';
        mobileHeader.style.opacity = '0';
        mobileHeader.style.transform = 'translateY(100%)';
      } else {
        mobileHeader.style.transition = 'all 0.2s ease';
        mobileHeader.style.opacity = '1';
        mobileHeader.style.transform = 'translateY(0)';
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* 데스크톱 헤더 */}
      <header className="hidden lg:block sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link className="text-brand-primary text-xl font-bold" to="/">
              conduit
            </Link>
            <ul className="flex items-center space-x-6">
              <NavLinks isLoggedIn={isLoggedIn} user={user} />
            </ul>
          </div>
        </nav>
      </header>

      {/* 모바일 하단 네비게이션 */}
      <header
        id="mobile-header"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
      >
        {/* 불투명한 배경 레이어 */}
        <div className="absolute inset-0 bg-white dark:bg-gray-800 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.3)]" />

        {/* 네비게이션 컨텐츠 */}
        <nav className="relative container mx-auto px-4">
          <ul className="flex items-center justify-around h-16">
            <li>
              <NavLink
                to="/"
                end
                className={({isActive}) => `
                  flex flex-col items-center text-sm
                  ${isActive ? 'text-brand-primary' : 'text-gray-500'}
                `}
              >
                <HomeIcon />
                <span>Home</span>
              </NavLink>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <NavLink
                    to="/editor"
                    className={({isActive}) => `
                      flex flex-col items-center text-sm
                      ${isActive ? 'text-brand-primary' : 'text-gray-500'}
                    `}
                    end
                  >
                    <EditIcon />
                    <span>New Article</span>
                  </NavLink>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="flex flex-col items-center text-sm text-gray-500"
                  >
                    <SettingsIcon />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${user?.username}`}
                    className="flex flex-col items-center text-sm text-gray-500"
                  >
                    <img
                      src={
                        user?.image ||
                        `https://ui-avatars.com/api/?name=${user?.username}`
                      }
                      className="w-6 h-6 rounded-full mb-1"
                      alt={user?.username || ''}
                    />
                    <span>Profile</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({isActive}) => `
                      flex flex-col items-center text-sm
                      ${isActive ? 'text-brand-primary' : 'text-gray-500'}
                    `}
                  >
                    <LoginIcon />
                    <span>Sign in</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/register"
                    className={({isActive}) => `
                      flex flex-col items-center text-sm
                      ${isActive ? 'text-brand-primary' : 'text-gray-500'}
                    `}
                  >
                    <RegisterIcon />
                    <span>Sign up</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
};

const NavLinks = ({isLoggedIn, user}: NavLinksProps) => (
  <>
    <li>
      <NavLink
        to="/"
        end
        className={({isActive}) => `
          hover:text-brand-primary transition-colors
          ${isActive ? 'text-brand-primary' : 'text-gray-600 dark:text-gray-300'}
        `}
      >
        Home
      </NavLink>
    </li>
    {!isLoggedIn ? (
      <>
        <li>
          <NavLink
            to="/login"
            className={({isActive}) => `
              hover:text-brand-primary transition-colors
              ${isActive ? 'text-brand-primary' : 'text-gray-600 dark:text-gray-300'}
            `}
          >
            Sign in
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className={({isActive}) => `
              hover:text-brand-primary transition-colors
              ${isActive ? 'text-brand-primary' : 'text-gray-600 dark:text-gray-300'}
            `}
          >
            Sign up
          </NavLink>
        </li>
      </>
    ) : (
      <>
        <li>
          <NavLink
            to="/editor"
            className={({isActive}) => `
              hover:text-brand-primary transition-colors
              ${isActive ? 'text-brand-primary' : 'text-gray-600 dark:text-gray-300'}
            `}
            end
          >
            New Article
          </NavLink>
        </li>
        <li>
          <Link
            to="/settings"
            className="text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors"
          >
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>
        <li>
          <Link
            to={`/profile/${user?.username}`}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-brand-primary transition-colors"
          >
            <img
              src={
                user?.image ||
                `https://ui-avatars.com/api/?name=${user?.username}`
              }
              className="w-8 h-8 rounded-full mr-2"
              alt={user?.username}
            />
            {user?.username}
          </Link>
        </li>
      </>
    )}
  </>
);

const HomeIcon = ({className = 'w-6 h-6'}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const EditIcon = ({className = 'w-6 h-6'}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const SettingsIcon = ({className = 'w-6 h-6'}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const LoginIcon = ({className = 'w-6 h-6'}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
    />
  </svg>
);

const RegisterIcon = ({className = 'w-6 h-6'}) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

export default Header;
