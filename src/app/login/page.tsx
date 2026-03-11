"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import PublicRoute from "@/components/auth/PublicRoute";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setError(t.login.completeFields);
        } else if (response.status === 401) {
          setError(t.login.invalidCredentials);
        } else {
          setError(t.login.serverError);
        }
        setLoading(false);
        return;
      }

      sessionStorage.setItem("authenticated", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(t.login.connectionError);
      setLoading(false);
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="text-center text-3xl">
                {t.login.title}
              </CardTitle>
              <p className="text-soft text-center text-sm mt-2">
                {t.login.subtitle}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    {t.login.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2"
                    placeholder={t.login.emailPlaceholder}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    {t.login.password}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-2"
                    placeholder={t.login.passwordPlaceholder}
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? t.login.loggingIn : t.login.loginBtn}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-soft text-sm">
                  {t.login.forgotPassword}{" "}
                  <a href="#" className="text-[var(--brand)] hover:underline">
                    {t.login.recoverAccess}
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-soft text-sm">{t.login.systemInfo}</p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
