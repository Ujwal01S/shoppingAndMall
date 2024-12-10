"use server";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import * as z from "zod";
import { getUserByName } from "@/queries/user";
import { User } from "@/model/user";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(data);
  // console.log("1st");

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, password } = validatedFields.data;

  const existingUser = await getUserByName(name);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  //below code to show invalid password

  const user = await User.findOne({
    name: name,
  });

  const passwordMatch = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!passwordMatch) {
    return { error: "Invalid password" };
  }

  //upto enclosed by comment

  try {
    await signIn("credentials", {
      name,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
      }
    }
    throw error;
  }
};
