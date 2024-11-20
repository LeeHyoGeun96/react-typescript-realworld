interface SelectTagProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const SelectTag = ({tags, onTagClick}: SelectTagProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <aside className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-[180px] ">
      <section>
        <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Popular Tags
        </h2>

        <nav>
          <ul className="flex flex-wrap gap-2 lg:grid lg:grid-cols-2">
            {tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="inline-block px-2 py-1 text-sm text-gray-600 dark:text-gray-300 
                           bg-gray-200 dark:bg-gray-700 
                           hover:bg-gray-300 dark:hover:bg-gray-600
                           rounded-full transition-colors"
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </aside>
  );
};

export default SelectTag;
