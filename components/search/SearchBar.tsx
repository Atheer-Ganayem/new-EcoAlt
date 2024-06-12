"use client";

import useTip from "@/hooks/useTip";
import { Button, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

interface Props {
  currentKey: string;
}

const SearchBar: React.FC<Props> = ({ currentKey }) => {
  const tip = useTip();
  function onSearchHandler(formData: FormData) {
    const key = formData.get("key") as string;

    if (!key || key.trim().length === 0 || key === currentKey) {
      return;
    }

    redirect(`/search?key=${key}`);
  }

  return (
    <>
      <form className="flex justify-center" action={onSearchHandler}>
        <Input
          classNames={{
            base: "h-12 max-w-96 ",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-s-xl rounded-e-none",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          name="key"
          className="rounded-e-none"
          defaultValue={currentKey}
        />
        <Button className="h-12 rounded-s-none" color="success" type="submit">
          <SearchIcon />
        </Button>
      </form>
      {tip && (
        <h1 className="text-3xl text-center mt-3 font-bold">
          Tip: <span className="text-primary">{tip}</span>
        </h1>
      )}
    </>
  );
};

function Submit() {
  const { pending } = useFormStatus();

  return (
    <Button className="h-12 rounded-s-none" color="success" isLoading={pending}>
      {!pending && <SearchIcon />}
    </Button>
  );
}

export default SearchBar;
