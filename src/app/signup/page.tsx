import SignupForm from "@/components/signup-form";

export default function SignupPage() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center bg-background p-4 overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
            <div className="w-full max-w-md z-10">
                <SignupForm />
            </div>
        </div>
    );
}
