import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";

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

            <form className="mt-7 space-y-5">
              <div>
                <label htmlFor="email" className="field-label">Email address</label>
                <input id="email" name="email" type="email" className="field" />
              </div>
              <div>
                <label htmlFor="password" className="field-label">Password</label>
                <input id="password" name="password" type="password" className="field" />
              </div>
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                <span>Remember me on this device</span>
              </label>
              <button type="submit" className="btn-primary w-full">
                Log in
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link href="/contact" className="font-semibold text-brand-600 hover:underline">
                Contact us to get access
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
