"use client";

import { Card, CardBody, Input } from "@nextui-org/react";
import { Check } from "lucide-react";
import SubmitBtn from "../UI/SubmitBtn";
import { useFormState } from "react-dom";
import { changePassword } from "@/utils/actions/user";
import ErrorAlert from "@/components/UI/ErrorAlert";

interface Props {
  userId: string;
}

const PasswordChange: React.FC<Props> = ({ userId }) => {
  const [state, formAction] = useFormState(changePassword, {
    error: false,
    code: 200,
    message: "",
  });

  return (
    <form action={formAction}>
      <Card className="w-full max-w-96 p-5 mx-auto flex flex-col items-center gap-6">
        <h1 className="font-bold text-xl">Change Password</h1>

        <input type="hidden" value={userId} name="userId" />

        <Input
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          type="password"
          variant="bordered"
          className="w-full min-w-full max-w-full"
        />

        <Input
          name="newPassword"
          label="New Password"
          placeholder="Enter the new password"
          type="password"
          variant="bordered"
          className="w-full min-w-full max-w-full"
        />

        <Input
          name="confirmNewPassword"
          label="Confirm New Password"
          placeholder="Enter the new password again"
          type="password"
          variant="bordered"
          className="w-full min-w-full max-w-full"
        />

        {state.error && <ErrorAlert text={state.message} />}
        {!state.error && state.code === 201 && (
          <div className="border-success border-3 rounded-lg">
            <Card>
              <CardBody className="bg-success-100 text-current flex gap-3 flex-row">
                <Check />
                {state.message}
              </CardBody>
            </Card>
          </div>
        )}
        <SubmitBtn text="Change Password" />
      </Card>
    </form>
  );
};

export default PasswordChange;
