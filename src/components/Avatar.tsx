import {useState} from 'react';

interface AvatarProps {
  username: string;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({
  username,
  image,
  size = 'md',
  className = '',
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}`;

  const handleError = () => {
    setImgError(true);
  };

  return (
    <img
      src={imgError || !image ? defaultImage : image}
      alt={`${username}'s avatar`}
      onError={handleError}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
};

export default Avatar;
