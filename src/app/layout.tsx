import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Virtual UNICA | Seguimiento de Trámites Académicos",
  description:
    "Consulta el estado de tus trámites académicos en la UNICA, el área responsable, los documentos pendientes y la última actualización de tu solicitud.",
  applicationName: "Campus Virtual UNICA",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6600",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-unica-bg font-sans">{children}</body>
    </html>
  );
}
