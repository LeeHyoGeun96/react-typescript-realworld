import React, {useState} from 'react';
import TagList from './TagList';

interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const TagInput = ({tags, onAddTag, onRemoveTag}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      onAddTag(inputValue);
      setInputValue('');
    }
  };

  return (
    <fieldset className="form-group">
      <input
        type="text"
        className="form-control"
        placeholder="Enter tags"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <TagList tags={tags} onRemoveTag={onRemoveTag} />
    </fieldset>
  );
};

export default TagInput;
