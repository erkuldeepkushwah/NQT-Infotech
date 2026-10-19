import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the NQT Infotech client portal.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero title="Login" />

      <section className="section">
        <div className="container-x">
          <div className="mx-auto max-w-md rounded-xl bg-slate-50 p-8">
            <h2 className="text-xl font-semibold text-navy-800">Login to your account</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your details below to sign in.
            </p>

            <div className="mt-7">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
