interface TagListProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
}

const TagList = ({tags, onRemoveTag}: TagListProps) => {
  return (
    <ul className="flex items-center gap-1 ">
      {tags.map((tag) => (
        <li
          key={tag}
          className="block px-2 py-1 text-sm
              rounded-full transition-colors
              whitespace-nowrap"
        >
          {onRemoveTag && (
            <button
              onClick={() => onRemoveTag(tag)}
              className="mr-1 hover:text-red-500 focus:outline-none "
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
          {tag}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
