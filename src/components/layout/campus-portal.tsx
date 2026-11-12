"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LoginScreen } from "@/components/layout/login-screen";
import { SeguimientoApp } from "@/components/seguimiento-app";
import { useSeguimientoStore } from "@/store/useSeguimientoStore";

export function CampusPortal() {
  const sesion = useSeguimientoStore((state) => state.sesion);

  if (!sesion) return <LoginScreen />;

  return (
    <div className="flex min-h-screen flex-col bg-unica-bg">
      <Header />
      <div className="flex-1">
        <SeguimientoApp />
      </div>
      <Footer />
    </div>
  );
}
