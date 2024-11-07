interface TagListProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
}

const TagList = ({tags, onRemoveTag}: TagListProps) => {
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li key={tag} className="tag-default tag-pill">
          {onRemoveTag ? (
            <i className="ion-close-round" onClick={() => onRemoveTag(tag)}></i>
          ) : null}
          {tag}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
