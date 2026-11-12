import type { Metadata } from "next";

import { CampusPortal } from "@/components/layout/campus-portal";

export const metadata: Metadata = {
  title: "Mis Trámites | Campus Virtual UNICA",
  description:
    "Módulo protegido de seguimiento de trámites académicos del Campus Virtual de la UNICA.",
};

export default function MisTramitesPage() {
  return <CampusPortal />;
}
