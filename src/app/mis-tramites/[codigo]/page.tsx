import type { Metadata } from "next";

import { CampusPortal } from "@/components/layout/campus-portal";
import { parsearEstadoSimulado } from "@/lib/estados";

interface TramitePageProps {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ STATUS?: string | string[] }>;
}

export async function generateMetadata({
  params,
}: Pick<TramitePageProps, "params">): Promise<Metadata> {
  const { codigo } = await params;

  return {
    title: `Trámite ${codigo} | Campus Virtual UNICA`,
    description:
      "Consulta el avance, el área responsable, los documentos pendientes y la última actualización de tu trámite académico.",
  };
}

export default async function TramitePage({
  params,
  searchParams,
}: TramitePageProps) {
  const [{ codigo }, query] = await Promise.all([params, searchParams]);

  return (
    <CampusPortal
      codigoInicial={codigo}
      simulacion={parsearEstadoSimulado(query.STATUS)}
    />
  );
}
