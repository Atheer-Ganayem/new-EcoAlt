"use client";

import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthPage = () => {
  const mode = useSearchParams().get("mode");

  const [selectedTab, setSelectedTab] = useState<"login" | "signup" | string>(
    mode === "signup" ? mode : "login"
  );

  return (
    <div className="flex w-full flex-col items-center mt-32">
      <Tabs
        color="success"
        selectedKey={selectedTab}
        onSelectionChange={key => setSelectedTab(key as string)}
      >
        <Tab key="login" title="Login">
          <Card className="max-w-xl">
            <CardBody>
              <LoginForm />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="signup" title="Signup">
          <Card className="max-w-xl">
            <CardBody>
              <SignupForm />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AuthPage;
