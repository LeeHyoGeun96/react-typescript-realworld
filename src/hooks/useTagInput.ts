import { useState } from 'react';

export const useTagInput = (initialTags: string[] = []) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  const addTag = (newTag: string) => {
    if (newTag.trim() && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return {
    tags,
    addTag,
    removeTag,
  };
};
