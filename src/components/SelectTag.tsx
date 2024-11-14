interface SelectTagProps {
  tags: string[];
  onTagClick: (tag: string) => void;
}

const SelectTag = ({tags, onTagClick}: SelectTagProps) => {
  return (
    <div className="col-md-3">
      <div className="sidebar">
        <p>Popular Tags</p>

        <div className="tag-list">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="tag-pill tag-default"
              onClick={() => onTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectTag;
