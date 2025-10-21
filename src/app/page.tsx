import ParkingAnimation from "@/components/parking-animation";
import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
         <ParkingAnimation />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:justify-end">
        <div className="w-full max-w-md md:mr-[10%]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
