"use client";

import CreateUserContent from "@/components/modules/createUserModules";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const CreateUserPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    if (!session?.user.isAdmin) {
      redirect("/");
    }
    if (session.user.role === "user") {
      redirect("/");
    }
  }, [session]);
  return (
    <>
      <CreateUserContent />
    </>
  );
};

export default CreateUserPage;
