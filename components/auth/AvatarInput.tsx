import { Avatar, divider } from "@nextui-org/react";
import { UserPlus } from "lucide-react";
import React, { useRef, useState } from "react";

const AvatarInput = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];

    if (!file) {
      return setPreview(null);
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreview(fileReader.result as string);
    };

    fileReader.readAsDataURL(file);
  }

  return (
    <div className="flex gap-4 items-center">
      <input type="file" name="avatar" hidden ref={fileInputRef} onChange={handleImageChange} />
      {preview ? (
        <Avatar
          onClick={() => fileInputRef.current?.click()}
          src={preview}
          className="w-20 h-20 text-large cursor-pointer"
        />
      ) : (
        <UserPlus
          className="w-20 h-20 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
      )}
    </div>
  );
};

export default AvatarInput;
