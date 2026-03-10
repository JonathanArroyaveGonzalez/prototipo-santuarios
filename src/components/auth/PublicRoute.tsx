"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("authenticated");
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [router]);

  return <>{children}</>;
}
