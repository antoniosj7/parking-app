import LoginForm from "@/components/login-form";
import ParkingAnimation from "@/components/parking-animation";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 overflow-hidden">
      <ParkingAnimation />
      <div className="w-full max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
}
