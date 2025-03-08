interface TagListProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
  className?: string;
}

const TagList = ({tags, onRemoveTag, className = ''}: TagListProps) => {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <li key={tag} className="flex items-center  gap-1">
          <div
            className={`
              flex items-center
               px-2 py-1 text-sm
              rounded-full transition-colors
              whitespace-nowrap
              text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700
            `}
          >
            {onRemoveTag && (
              <button
                onClick={() => onRemoveTag(tag)}
                className="mr-1 hover:text-red-500 focus:outline-none"
                aria-label={`Remove ${tag} tag`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            <span>{tag}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
