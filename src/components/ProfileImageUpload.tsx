
import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileImageUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ value, onChange }) => {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className="relative w-24 h-24 rounded-full overflow-hidden transition-all-medium bg-muted"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          cursor: 'pointer',
        }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Profile"
              className="w-full h-full object-cover transition-all-medium"
              style={{
                opacity: isHovering ? 0.7 : 1,
              }}
            />
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all-medium">
                <Upload className="h-8 w-8 text-white" />
              </div>
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0 rounded-full h-6 w-6 p-0 transform translate-x-1/4 -translate-y-1/4"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <span className="text-xs text-muted-foreground">
        {value ? 'Change image' : 'Upload image'}
      </span>
    </div>
  );
};

export default ProfileImageUpload;
