import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to the Brivora client portal.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero title="Login" />

      <section className="section">
        <div className="container-x">
          <div className="mx-auto max-w-md rounded-xl bg-slate-50 p-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
