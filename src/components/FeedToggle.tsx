import {Link} from 'react-router-dom';

interface FeedToggleProps {
  params: {
    tab: string | undefined;
    tag: string | undefined;
  };
  isLoggedIn: boolean;
}

const FeedToggle = ({params, isLoggedIn}: FeedToggleProps) => (
  <div className="feed-toggle">
    <ul className="nav nav-pills outline-active">
      {isLoggedIn && (
        <li className="nav-item">
          <Link
            to="?tab=personal"
            className={`nav-link ${params.tab === 'personal' ? 'active' : ''}`}
          >
            Your Feed
          </Link>
        </li>
      )}
      <li className="nav-item">
        <Link
          to="?tab=global"
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

export default FeedToggle;
