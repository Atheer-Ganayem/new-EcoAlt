import { Button } from "@nextui-org/button";
import { Trash } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import ErrorAlert from "@/components/UI/ErrorAlert";
import { deleteUser } from "@/utils/actions/user";

const DeleteUserBtn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { data: session } = useSession();
  const { userId }: { userId: string } = useParams();

  async function deleteHandler() {
    setLoading(true);
    try {
      const result = await deleteUser(userId);

      if (result.error) {
        setError(result.message);
      }
      if (result.code === 201 && userId === session?.user.id) {
        signOut();
        router.replace("/auth");
      } else if (result.code === 201 && session?.user.isAdmin) {
        router.replace("/admin/users");
      }
    } catch (error) {
      setError("An errro occurred, please try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-4 flex-col max-w-96 mx-auto mb-10">
      <Button
        className="w-fit"
        color="danger"
        variant="ghost"
        startContent={<Trash />}
        isLoading={loading}
        onClick={deleteHandler}
      >
        Delete user
      </Button>
      {error && <ErrorAlert text={error} />}
    </div>
  );
};

export default DeleteUserBtn;
