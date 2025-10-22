import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 overflow-hidden">
       <div className="absolute inset-0 z-0 bg-gradient-to-br from-background to-blue-50/50 dark:to-blue-950/20"></div>
      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
}
