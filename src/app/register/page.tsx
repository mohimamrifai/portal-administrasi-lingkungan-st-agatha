import { RegisterForm } from "@/components/register-form";

// Catatan: Register harus submit ke endpoint API custom (misal: /api/register),
// bukan ke NextAuth.js, karena NextAuth.js tidak handle register user baru.

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  )
}
