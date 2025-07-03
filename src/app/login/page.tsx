import AuthForm from "@/components/shared/AuthForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 flex items-center justify-center">
      <AuthForm type="login" />
    </div>
  );
}
