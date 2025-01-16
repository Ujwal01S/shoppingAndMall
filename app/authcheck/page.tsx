import { auth } from "@/auth";

const serverMallData = async () => {
  const response = await fetch("http://localhost:3000/api/mall");
  const data = response.json();
  return data;
};

const AuthCheckPage = async () => {
  const session = await auth();
  return <p className="mt-40">{session?.user.role}</p>;
};

export default AuthCheckPage;
