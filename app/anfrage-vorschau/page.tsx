import AnfrageFormular from "@/components/AnfrageFormular"

/**
 * Interne Vorschau des neuen Anfrage-Formulars (nicht verlinkt).
 * Route: /anfrage-vorschau — nur zum Ansehen/Testen während der Entwicklung.
 */
export default function AnfrageVorschauPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#b4b1aa", padding: "48px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", textAlign: "center", fontSize: 28, marginBottom: 24 }}>
          Terminanfrage (Vorschau)
        </h1>
        <AnfrageFormular />
      </div>
    </main>
  )
}
