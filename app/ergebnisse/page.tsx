import { redirect } from "next/navigation"

/**
 * /ergebnisse ist vorübergehend offline – die Seite wird komplett neu aufgebaut.
 * Bis dahin leiten wir Besucher freundlich auf die Startseite (307, temporär),
 * damit alte Links (E-Mails, Lesezeichen, Suchmaschinen) nicht ins Leere laufen.
 *
 * Der bisherige Inhalt liegt in der Git-Historie und kann beim Neuaufbau
 * referenziert werden. Der Bild-Ordner /public/ergebnisse bleibt unberührt
 * (die Bilder werden weiterhin auf anderen Seiten verwendet).
 */
export default function ErgebnissePage() {
  redirect("/")
}
