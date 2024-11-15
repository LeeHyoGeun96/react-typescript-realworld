import {Link, useSearchParams} from 'react-router-dom';

interface FeedToggleProps {
  params: {
    tab: string | undefined;
    tag: string | undefined;
  };
  isLoggedIn: boolean;
  onTabChange: (tab: string) => void;
  disabled?: boolean;
}

const FeedToggle = ({params, isLoggedIn, onTabChange}: FeedToggleProps) => {
  const [searchParams] = useSearchParams();

  // Link의 state prop을 통해 클릭 이벤트 감지
  const handleStateChange = (e: any) => {
    const tab = new URLSearchParams(e.currentTarget.getAttribute('to')).get(
      'tab',
    );
    if (tab) onTabChange(tab);
  };

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {isLoggedIn && (
          <li className="nav-item">
            <Link
              to="?tab=personal"
              state={{from: searchParams.toString()}}
              onClick={handleStateChange}
              className={`nav-link ${params.tab === 'personal' ? 'active' : ''}`}
            >
              Your Feed
            </Link>
          </li>
        )}
        <li className="nav-item">
          <Link
            to="?tab=global"
            state={{from: searchParams.toString()}}
            onClick={handleStateChange}
            className={`nav-link ${params.tab === 'global' ? 'active' : ''}`}
          >
            Global Feed
          </Link>
        </li>
        {params.tab === 'tag' && (
          <li className="nav-item">
            <span className="nav-link active">{`#${params.tag}`}</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default FeedToggle;
