import { User } from "@/model/user";

interface UserProps {
  name: string;
  password: string;
}

export async function createUser(userData: UserProps) {
  try {
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknow error occurs while creating the user");
    }
  }
}

export async function getUserByName(name: string) {
  const user = await User.findOne({ name }).select("-password").lean();
  return user;
}

export async function getUserById(id: string) {
  const user = await User.findById(id).select("-password").lean();
  return user;
}

export async function updateUserById(id: string, role: string) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).lean();
    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred while updating the user");
    }
  }
}
