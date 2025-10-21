import ParkingAnimation from "@/components/parking-animation";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="relative z-10 flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] w-full">
        <ParkingAnimation />
      </div>
    </div>
  );
}
