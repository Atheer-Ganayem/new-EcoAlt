import { Button } from "@nextui-org/button";
import { Trash } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface Props {
  setFiles: React.Dispatch<React.SetStateAction<(File | string)[]>>;
  previews: string[];
  remove: (index: number) => void;
}

const ImagesInput: React.FC<Props> = ({ setFiles, previews, remove }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFileHandler(file: File | null) {
    if (!file) {
      return;
    }
    setFiles(prev => [...prev, file]);
  }

  return (
    <>
      <input
        onChange={e => chooseFileHandler(e.target.files ? e.target.files[0] : null)}
        ref={inputRef}
        hidden
        type="file"
        accept=".jpg, .jpeg, .png"
      />
      <div className="flex flex-col mx-auto gap-2">
        {previews.map((preview, index) => (
          <div key={index}>
            <Image
              src={preview.includes(",") ? preview : process.env.AWS + preview}
              width={300}
              height={500}
              alt={preview}
            />
            <Button
              className="m-0 w-full rounded-t-none"
              color="danger"
              onClick={() => remove(index)}
            >
              Remove <Trash />
            </Button>
          </div>
        ))}
      </div>
      <Button color="secondary" variant="flat" onClick={() => inputRef.current?.click()}>
        Add Images
      </Button>
    </>
  );
};

export default ImagesInput;
