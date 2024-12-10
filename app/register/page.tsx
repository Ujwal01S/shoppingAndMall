import RegisterForm from "@/components/auth/registerForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RegisterForm />
      <p className="text-xs ">
        Already have an account?{" "}
        <span className="underline font-bold">
          <Link href="/login">Login</Link>
        </span>
      </p>
    </div>
  );
};

export default RegisterPage;
