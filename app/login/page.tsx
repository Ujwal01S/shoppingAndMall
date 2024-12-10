import LoginForm from "@/components/auth/loginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm />
      <p className="text-xs ">Don&apos;t have an account? <span className="underline font-bold">
        <Link href="/register">Register</Link>
    </span></p>
    </div>
  );
};

export default LoginPage;
