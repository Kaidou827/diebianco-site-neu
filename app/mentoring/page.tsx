"use client"

import type React from "react"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  Lightbulb,
  Briefcase,
  TrendingUp,
  UserCheck,
  Gem,
  Settings,
  Megaphone,
  Users,
  Rocket,
  Brain,
  Cog,
  PhoneCall,
  ClipboardList,
  Video,
  BookOpen,
  MapPin,
  Award,
  Sparkles,
  Heart,
  Scissors,
  Palette,
  Medal,
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { DeviceTestingPanel } from "@/components/device-testing"
import { ResponsiveTestGrid } from "@/components/responsive-test-grid"

/* -------------------------------------------------- */
/* Framer-motion helpers */
/* -------------------------------------------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 50 }, // Changed y from 1 to 50 for a more noticeable slide-up
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }, // Dauer von 0.01 auf 0.5 geändert
  },
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const hoverScale = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { scale: 1.03, boxShadow: "0 8px 16px rgba(0,0,0,0.12)" },
}

const hoverButton = {
  initial: { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" },
  hover: { scale: 1.05, boxShadow: "0 4px 8px rgba(153,0,76,0.4)" },
}

const slideFromLeft = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

// FAQ Accordion Component
function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqData = [
    {
      question: "Für wen eignet sich das Mentoring?",
      answer:
        "Für etablierte oder angehende Salon-Inhaber:innen, Friseur:innen und Beauty-Profis, die auf Premium-Level wachsen wollen und bereit sind, ihre Business-Prozesse zu professionalisieren.",
    },
    {
      question: "Wie lange dauert das Mentoring insgesamt?",
      answer:
        "Das Basisprogramm erstreckt sich über 6 Monate und ist individuell anpassbar je nach deinen Zielen und deinem Bedarf.",
    },
    {
      question: "Welche Vorkenntnisse brauche ich?",
      answer:
        "Du solltest bereits einige Jahre Praxiserfahrung haben. Das Wichtigste ist deine Bereitschaft, dich weiterzuentwickeln und offen für Veränderungen zu sein.",
    },
    {
      question: "Welche Kosten entstehen?",
      answer:
        "Da jedes Mentoring individuell ist, erläutern wir dir die Investition gerne in einem kostenlosen und unverbindlichen Erstgespräch. Wir gewährleisten volle Transparenz.",
    },
    {
      question: "Wie viele Teilnehmende gibt es maximal?",
      answer:
        "Die Teilnehmerzahl im Mentoring ist stark begrenzt, um jedem die beste und intensivste Betreuung zu garantieren.",
    },
  ]

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqData.map((item, index) => (
        <motion.div
          key={index}
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-1 border border-white/10 shadow-2xl"
          initial="initial"
          whileHover="hover"
          viewport={{ once: true, amount: 0.25 }} // Beibehalten, da es nicht Teil der spezifischen Anfrage war
          variants={fadeInUp}
        >
          <div className="bg-gradient-to-br from-[#2c2c2c] to-[#3a3a3a] rounded-xl">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/30 rounded-xl transition-all duration-300"
            >
              <h3 className="text-lg md:text-xl font-medium text-white pr-4">{item.question}</h3>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <svg className="w-6 h-6 text-[#D4C6A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: openIndex === index ? "auto" : 0,
                opacity: openIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-6">
                <p className="text-white/80 leading-relaxed">{item.answer}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* -------------------------------------------------- */
/* Page component */
/* -------------------------------------------------- */
export default function FarinaLandingPage() {
  const [headerBg, setHeaderBg] = useState("bg-[#c2c2c2]/80 backdrop-blur-md")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800)
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHeaderBg("bg-transparent")
      } else {
        setHeaderBg("bg-[#c2c2c2]/80 backdrop-blur-md")
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Add a ref for the bio section to track its scroll progress
  const bioSectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: bioSectionRef,
    offset: ["start start", "end end"], // Tracks scroll progress from when the top of the section hits the viewport to when its bottom leaves
  })

  // Define opacity for each block based on scrollYProgress
  // Block 1: Intro Text + Bio (0% to 25% of section scroll) - Schnellere Animation
  const opacity1 = useTransform(scrollYProgress, [0, 0.004, 0.16, 0.2], [0, 1, 1, 0])

  // Block 2: Key Metrics Icons (20% to 45% of section scroll) - Schnellere Animation
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.204, 0.36, 0.4], [0, 1, 1, 0])

  // Block 3: Quote (45% to 70% of section scroll) - Schnellere Animation
  const opacity3 = useTransform(scrollYProgress, [0.4, 0.404, 0.56, 0.6], [0, 1, 1, 0])

  // Block 4: Expertise Cards (70% to 100% of section scroll) - Schnellere Animation
  const opacity4 = useTransform(scrollYProgress, [0.6, 0.604, 1], [0, 1, 1]) // Stays visible until the end of the section

  const learningOverviewCardData = [
    {
      icon: Lightbulb,
      title: "Uneinheitliche Preispolitik & Positionierung",
      description:
        "Viele Profis wissen zwar, dass ihre Leistung Premium ist, scheuen aber davor zurück, höhere Preise durchzusetzen.",
    },
    {
      icon: Briefcase,
      title: "Mangelnde Unternehmensstrukturen",
      description: "Ohne klar definierte Prozesse läuft oft das Tagesgeschäft und nicht das Business.",
    },
    {
      icon: TrendingUp,
      title: "Schwaches Marketing und wenig neue Kunden",
      description: "Aufträge schwanken stark und Stammkunden bleiben nicht treu.",
    },
  ]

  const momentCardsData = [
    {
      icon: Brain,
      quote: "Herausarbeiten deiner persönlichen Markenbotschaft und Premium-Anspruch kommunizieren.",
      client: "Mindset & Positionierung",
    },
    {
      icon: Cog,
      quote: "Einführung standardisierter Abläufe und digitaler Tools für mehr Effizienz.",
      client: "Business & Prozess Architektur",
    },
    {
      icon: Megaphone,
      quote: "Social-Media-Roadmap und professionelle Kundenakquise für dein Studio.",
      client: "Marketing & Vertriebsstrategie",
    },
    {
      icon: Users,
      quote: "Recruiting, Motivation, Feedback-Prozesse und Teamentwicklung meistern.",
      client: "Team & Mitarbeiterführung",
    },
    {
      icon: Gem,
      quote: "Hochwertige Service-Pakete entwickeln und Upselling-Potenziale nutzen.",
      client: "Praxis-Feinschliff & Premium-Services",
    },
    {
      icon: Rocket,
      quote: "Stärke deine Führungsfähigkeiten und plane, wie dein Geschäft wachsen kann.",
      client: "Persönliche Entwicklung & Wachstum",
    },
  ]

  const coachingTimelineData = [
    {
      icon: PhoneCall,
      title: "Kostenloses Beratungsgespräch",
      text: "30 minütiger Call, um Ziele, Ist Zustand und Erwartungen zu klären.",
    },
    {
      icon: ClipboardList,
      title: "Kick off & Status Quo Analyse",
      text: "Gemeinsamer Workshop (vor Ort oder online) zur Analyse deines Salons und erster Handlungsempfehlungen.",
    },
    {
      icon: Video,
      title: "Wöchentliche Live Calls & Q&As",
      text: "4× pro Monat Fachvorträge (Verkauf, Rhetorik, Social Media) und Calls für individuelle Fragen.",
    },
    {
      icon: BookOpen,
      title: "Online Lernplattform & Ressourcen",
      text: "Videokurse, Vorlagen, Checklisten und Best Practice Beispiele für den Salon Alltag.",
    },
    {
      icon: MapPin,
      title: "Praxis Tage & Vor Ort Training",
      text: "Intensiv Schulung im Salon: Styling Techniken, Service Standards und Preis Workshops.",
    },
    {
      icon: Award,
      title: "Fortlaufende Betreuung & Transformation Tage",
      text: "Direkter Support via Messenger und exklusive Netzwerk Events mit allen Teilnehmenden.",
    },
  ]

  const keyMetricsData = [
    {
      type: "text",
      circleContent: "27+",
      title: "27+",
      subtitle: "Jahre Erfahrung",
    },
    {
      type: "icon",
      icon: Sparkles,
      title: "Innovative",
      subtitle: "Technik",
    },
    {
      type: "icon",
      icon: Heart,
      title: "100%",
      subtitle: "Leidenschaft",
    },
  ]

  const expertiseCardsData = [
    {
      icon: Scissors,
      title: "Schnitttechnik",
      subtitle: "Horizontal, Vertikal, Diagonal",
    },
    {
      icon: Palette,
      title: "Italienische Wurzeln",
      subtitle: "Leidenschaft & Präzision",
    },
    {
      icon: Medal,
      title: "Meisterausbildung",
      subtitle: "Mailand & Deutschland",
    },
    {
      icon: Gem,
      title: "DIE BIANCO",
      subtitle: "Exklusiver Salon",
    },
  ]

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const payload = {
      firstname: formData.get("firstname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
      pageUri: window.location.href,
      pageName: document.title,
      hutk:
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("hubspotutk="))
          ?.split("=")[1] ?? undefined,
    }

    try {
      const res = await fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      let json: { ok: boolean; message: string }
      if (res.headers.get("content-type")?.includes("application/json")) {
        json = await res.json()
      } else {
        const txt = await res.text()
        throw new Error(`Unerwartete Antwort: ${txt}`)
      }

      if (json.ok) {
        alert("Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.")
        form.reset() // ✅ safe after await
      } else {
        alert("Fehler beim Senden: " + json.message)
      }
    } catch (err) {
      console.error(err)
      alert("Netzwerk- oder Serverfehler – bitte später erneut versuchen.")
    }
  }

  return (
    <div className={`min-h-screen bg-background-beige text-gray-800 mobile-contained`}>
      {/* Testing Components - Only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <>
          <DeviceTestingPanel />
          <ResponsiveTestGrid />
        </>
      )}

      {/* -------------------  STICKY NAVIGATION BAR  ------------------- */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-colors duration-300 ${headerBg}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Image
            src="/Element1.png"
            alt="Website Logo"
            width={250}
            height={280}
            className="h-12 w-auto object-contain mb-4 max-w-full"
          />
        </div>
      </motion.header>

      <main className="pt-20">
        {/* -------------------  NEW HERO SECTION  ------------------- */}
        <section className="py-16 md:py-24 px-4 flex justify-center items-center min-h-[80vh] bg-[rgba(44,44,44,1)]">
          <motion.div
            className="rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-6xl w-full overflow-hidden lg:py-10 bg-[rgba(160,154,147,1)] my-[-50px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
            variants={fadeInUp}
          >
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left Content */}
              <motion.div className="space-y-6 text-3xl" variants={staggerContainer} initial="hidden" animate="visible">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl leading-tight text-[rgba(255,255,255,1)]"
                  variants={fadeInUp}
                >
                  {"Vom Salon zum "}
                  <motion.span
                    className="relative z-10 inline-block bg-gradient-to-r from-transparent via-[#f6dfb7] to-transparent bg-[length:200%_100%] animate-text-shine-pulse hover:text-shadow-glow-beige mobile-no-animation"
                    style={{
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                    variants={fadeInUp}
                  >
                    PremiumBrand
                  </motion.span>
                </motion.h1>
                {"Dein Mentoring für höhere Preise und nachhaltigen Erfolg"}

                <motion.p
                  className={`leading-relaxed text-xl text-black italic tracking-[-0.004em]`}
                  variants={fadeInUp}
                >
                  Erlerne bewährte <span className="text-[#f6dfb7] text-shadow-glow-beige">Strategien</span> um deinen{" "}
                  <span className="text-[#f6dfb7] text-shadow-glow-beige">Friseur- oder Beauty Betrieb</span> auf{" "}
                  <span className="text-[#f6dfb7] text-shadow-glow-beige">Premium Niveau</span> zu heben und deine{" "}
                  <span className="text-[#f6dfb7] text-shadow-glow-beige">Preise selbstbewusst zu kommunizieren.</span>
                </motion.p>

                <motion.div variants={fadeInUp}>
                  <motion.a
                    href="#kontakt" // Changed href to point to the contact section
                    onClick={(e) => {
                      e.preventDefault() // Prevent default hash navigation
                      document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#f6dfb7] text-black py-3 rounded-full text-base transition-colors px-2 font-light
     relative overflow-hidden shadow-button-shadow-beige
     bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.8)] to-transparent
     bg-[length:200%_100%] animate-shine-and-pulse mobile-no-animation"
                  >
                    <span className="relative z-10 text-shadow-glow-beige">Jetzt Termin Vereinbaren</span>
                    <ArrowRight className="w-4 h-4 relative z-10" />
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                <Image
                  src="/teresa-bianco.png" // Updated image source
                  alt="Teresa bianco"
                  width={500}
                  height={700}
                  className="rounded-full object-cover w-200 h-300 md:w-200 md:h-300 lg:w-200 lg:h-300 shadow-xl mt-[-0.5rem] max-w-full h-auto" // Hinzugefügte Klasse
                />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* -------------------  LEARNING OVERVIEW  ------------------- */}
        <motion.section
          id="ausbildung"
          className="py-16 md:py-24 px-4 flex justify-center items-center bg-[rgba(180,177,170,1)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, offset: ["start 0.2"] }} // Trigger, wenn 20% des Elements im Viewport sind
          variants={fadeInUp}
        >
          <motion.div
            className="rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-6xl w-full overflow-hidden lg:py-10 text-center bg-[rgba(128,123,118,1)]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl mb-12 text-white">
              Die drei häufigsten{" "}
              <motion.span
                className="relative z-10 inline-block bg-gradient-to-r from-transparent via-[#f6dfb7] to-transparent bg-[length:200%_100%] animate-text-shine-pulse hover:text-shadow-glow-beige text-[rgba(246,223,183,1)] mobile-no-animation"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent", // Fallback for non-webkit browsers
                }}
                variants={fadeInUp}
              >
                Herausforderungen
              </motion.span>{" "}
              in Salon und Studio
            </h2>
            <motion.p
              className={`leading-relaxed text-xl italic tracking-[-0.004em] pb-20 text-white`}
              variants={fadeInUp}
            >
              Wenn du deine Preise nicht selbstbewusst kommunizierst, verlierst du wertvolle Einnahmen{" "}
              <span className="text-[#f6dfb7] text-shadow-glow-beige">Fehlende Strukturen</span> binden dich an den
              Salonalltag,{" "}
              <span className="text-[#f6dfb7] text-shadow-glow-beige">unzureichende Marketingmaßnahmen</span> sorgen für{" "}
              <span className="text-[#f6dfb7] text-shadow-glow-beige">Umsatzlöcher</span>. Wenn du deine{" "}
              <span className="text-[#f6dfb7] text-shadow-glow-beige">Preise nicht selbstbewusst kommunizierst</span>,
              verlierst du <span className="text-[#f6dfb7] text-shadow-glow-beige">wertvolle Einnahmen</span>.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {learningOverviewCardData.map((card, index) => {
                const IconComponent = card.icon
                return (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl shadow-custom-light p-6 space-y-4"
                    variants={!isMobile ? hoverScale : undefined}
                    initial={!isMobile ? "initial" : undefined}
                    whileHover={!isMobile ? "hover" : undefined}
                  >
                    <motion.div
                      className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-custom-medium bg-[rgba(246,223,183,1)]"
                      whileHover={!isMobile ? { boxShadow: "0 0 15px #F6DFB7, 0 0 25px #F6DFB7" } : undefined}
                    >
                      <IconComponent className="w-12 h-12 text-black" />
                    </motion.div>
                    <h3 className="text-xl font-bold">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </motion.div>
                )
              })}
            </div>
            <motion.section
              className="container mx-auto px-4 py-16 md:py-24 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
              variants={fadeInUp}
            >
              <motion.div className="w-full max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl mb-12 text-center">
                  Eine Nachricht <span className="text-[#f6dfb7] text-shadow-glow-beige">an dich</span>
                </h2>

                <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-custom-medium">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://fast.wistia.net/embed/iframe/ovybobkz31?seo=false&amp;videoFoam=true"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                </div>

                <div className="mt-8 space-y-4 max-w-2xl mx-auto">
                  <motion.div className="flex items-center space-x-4" variants={fadeInUp}>
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent"
                      whileHover={!isMobile ? { boxShadow: "0 0 15px #F6DFB7, 0 0 25px #F6DFB7" } : undefined}
                    >
                      <UserCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-lg text-white text-left">1:1-Mentoring mit Branchenexpertin</p>
                  </motion.div>
                  <motion.div className="flex items-center space-x-4" variants={fadeInUp}>
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent"
                      whileHover={!isMobile ? { boxShadow: "0 0 15px #F6DFB7, 0 0 25px #F6DFB7" } : undefined}
                    >
                      <Gem className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-lg text-white text-left">
                      Erfolgsrezepte für Premium-Positionierung und Preisgestaltung
                    </p>
                  </motion.div>
                  <motion.div className="flex items-center space-x-4" variants={fadeInUp}>
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center bg-transparent"
                      whileHover={!isMobile ? { boxShadow: "0 0 15px #F6DFB7, 0 0 25px #F6DFB7" } : undefined}
                    >
                      <Settings className="w-8 h-8 text-white" />
                    </motion.div>
                    <p className="text-lg text-white text-left">Systematische Prozess- und Personalentwicklung</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.section>
          </motion.div>
        </motion.section>

        {/* -------------------  MOMENT CARDS  ------------------- */}
        <motion.section
          id="moment-cards" // Added ID for linking
          className="py-16 md:py-24 px-4 flex justify-center items-center bg-[rgba(54,53,53,1)]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
          variants={fadeInUp}
        >
          <motion.div
            className="rounded-3xl shadow-xl p-8 md:p-12 lg:p-16 max-w-6xl w-full overflow-hidden lg:py-10 bg-[rgba(160,154,147,1)] text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
            variants={fadeInUp}
          >
            <h2 className={`text-3xl md:text-4xl mb-12 relative z-10`}>
              TransformationsMentoring für Friseur:innen und Beauty-Profis
            </h2>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {momentCardsData.map((card, index) => (
                <motion.div
                  key={index}
                  className="rounded-xl shadow-custom-light p-6 space-y-4 bg-[rgba(144,142,136,1)]"
                  variants={!isMobile ? hoverScale : undefined}
                  initial={!isMobile ? "initial" : undefined}
                  whileHover={!isMobile ? "hover" : undefined}
                >
                  {(() => {
                    const IconComponent = card.icon
                    return (
                      <motion.div
                        className="mx-auto rounded-full flex items-center justify-center mb-4 shadow-custom-medium bg-[#2c2c2c] glow-gold-neon w-[60px] h-[60px]" // Black background, gold neon glow
                      >
                        {IconComponent && <IconComponent className="text-white w-10 h-10" />} {/* White icon */}
                      </motion.div>
                    )
                  })()}
                  <p className={`font-bold text-black`}>{card.client}</p>
                  <p className={`italic text-white`}>{card.quote}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* -------------------  COACHING TIMELINE  ------------------- */}
        <motion.section
          id="ablauf"
          className="py-16 md:py-24 px-4 bg-background-beige"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
          variants={fadeInUp}
        >
          <div className="container mx-auto max-w-4xl">
            <h2 className={`text-3xl md:text-4xl text-center mb-12 text-gray-800`}>Coaching‑Timeline</h2>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-[20px] md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-[#f6dfb7] h-full mx-0 z-[5]"></div>

              {coachingTimelineData.map((entry, index) => (
                <motion.div
                  key={index}
                  className={`grid grid-cols-[40px_1fr] md:grid-cols-[1fr_40px_1fr] items-center w-full mb-12 relative`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
                  variants={fadeInUp}
                >
                  {/* Textbox */}
                  <motion.div
                    className={`p-4 rounded-lg shadow-md bg-[rgba(255,255,255,1)] relative z-[1] col-start-2 col-end-3 ${index % 2 === 0 ? "md:col-start-1 md:col-end-2 md:text-right" : "md:col-start-3 md:col-end-4 md:text-left"}`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={index % 2 === 0 ? slideFromLeft : slideFromRight}
                  >
                    <h3 className="text-xl text-gray-900 mb-2 font-extrabold">{entry.title}</h3>
                    <p className="text-gray-700 text-sm">{entry.text}</p>
                  </motion.div>

                  {/* Marker */}
                  <div
                    className={`absolute w-10 h-10 rounded-full flex items-center justify-center z-10 bg-[#2c2c2c] glow-gold-neon
                  left-[20px] transform -translate-x-1/2 // Mobile: centered within its 40px column
                  md:left-1/2 md:transform md:-translate-x-1/2 // Desktop: centered on the page
                  `}
                  >
                    {entry.icon && <entry.icon className="w-6 text-white h-6" />}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* New Button */}
            <motion.div variants={fadeInUp} className="mt-12 flex justify-center">
              <motion.a
                href="#kontakt" // Changed href to point to the contact section
                onClick={(e) => {
                  e.preventDefault() // Prevent default hash navigation
                  document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth" })
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#f6dfb7] text-black py-3 rounded-full text-base transition-colors px-2 font-light
       relative overflow-hidden shadow-button-shadow-beige
       bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.8)] to-transparent
       bg-[length:200%_100%] animate-shine-and-pulse mobile-no-animation"
              >
                <span className="relative z-10 text-shadow-glow-beige">
                  Jetzt deinen Platz sichern - begrenzte Teilnehmerzahl!
                </span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

        {/* -------------------  DARK THEME (BIO) - Scroll-based Section  ------------------- */}
        <motion.section
          id="kunden"
          className="bg-dark-background text-white relative"
          style={{ height: isMobile ? "auto" : "400vh" }} // Conditional height
          ref={bioSectionRef} // Attach the ref to the section
        >
          <div className={isMobile ? "relative py-16 px-5" : "sticky top-0 h-screen flex items-center"}>
            <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center h-full bg-[rgba(44,44,44,1)]">
              {/* Image on the left - Always visible and static */}
              <div className="flex justify-center md:justify-start h-full">
                <Image
                  src="/teresa-bianco.png"
                  alt="Teresa Bianco"
                  width={450} // Reduced by 50px from 500
                  height={650} // Reduced by 50px from 700
                  className="rounded-full shadow-custom-medium object-cover max-w-full h-auto"
                />
              </div>

              {/* Right column - Sequential content blocks */}
              <div className="relative h-full flex flex-col justify-center md:col-start-2 md:col-end-3">
                {/* Block 1: Intro Text + Bio */}
                <motion.div
                  className={
                    isMobile
                      ? "relative space-y-6 z-10 text-sm"
                      : "absolute inset-0 flex flex-col justify-center space-y-6 z-10"
                  }
                  style={isMobile ? { opacity: 1 } : { opacity: opacity1 }}
                >
                  <h2 className="text-2xl md:text-5xl font-serif leading-tight">
                    Deine Mentorin:
                    <span className="text-[rgba(227,207,174,1)] text-shadow-glow-beige">Teresa Bianco</span>
                  </h2>
                  <h3 className="text-lg md:text-3xl font-serif text-gray-200">Spezialistin für Premium-Salons</h3>
                  <div className="text-xs md:text-base text-gray-300 space-y-4">
                    <p>
                      Mit über 27 Jahren Erfahrung als erfolgreiche Salon-Inhaberin und einer Ausbildung aus Mailand
                      habe ich meinen eigenen Weg von der Einzelkämpferin zum gefragten Premium-Salon gemeistert. Meine
                      Leidenschaft ist es, dieses Wissen weiterzugeben.
                    </p>
                    <p>
                      Ich bin fest davon überzeugt, dass Qualität, klare Abläufe und eine echte Markenbotschaft der
                      Schlüssel zu dauerhaftem Erfolg sind. Mein Ziel ist es, dich zu stärken, damit du dein volles
                      Potenzial nutzen und ein Geschäft aufbauen kannst, das dir nicht nur finanzielle Freiheit, sondern
                      auch persönliche Erfüllung bringt.
                    </p>
                  </div>
                </motion.div>
                {/* Block 2: Key Metrics Icons */}
                <motion.div
                  className={
                    isMobile ? "relative mt-12 space-y-6 z-10" : "absolute inset-0 flex flex-col justify-center z-10"
                  }
                  style={isMobile ? { opacity: 1 } : { opacity: opacity2 }}
                >
                  <div className="flex flex-col space-y-8">
                    {keyMetricsData.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 md:space-x-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center flex-shrink-0 bg-[rgba(246,223,183,1)]">
                          {item.type === "text" ? (
                            <span className="text-xl md:text-2xl font-bold text-black">{item.circleContent}</span>
                          ) : (
                            <item.icon className="w-8 h-8 md:w-10 md:h-10 text-black" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-lg md:text-xl font-bold text-white">{item.title}</h4>
                          <p className="text-sm md:text-base text-gray-300 italic">{item.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
                {/* Block 3: Quote */}
                <motion.div
                  className={
                    isMobile ? "relative mt-12 space-y-6 z-10" : "absolute inset-0 flex flex-col justify-center z-10"
                  }
                  style={isMobile ? { opacity: 1 } : { opacity: opacity3 }}
                >
                  <blockquote className="border-l-4 border-#ffffff pl-6 italic text-base md:text-xl text-[rgba(246,223,183,1)]">
                    <span className="text-shadow-glow-beige">
                      &quot;Mein Handwerk ist meine Sprache – ich sehe die Persönlichkeit eines Menschen. Je einfacher,
                      desto erfolgreicher wird dein Leben.&quot;
                    </span>
                  </blockquote>
                </motion.div>
                {/* Block 4: Expertise Cards */}
                <motion.div
                  className={
                    isMobile ? "relative mt-12 space-y-6 z-10" : "absolute inset-0 flex flex-col justify-center z-10"
                  }
                  style={isMobile ? { opacity: 1 } : { opacity: opacity4 }}
                >
                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {expertiseCardsData.map((card, index) => {
                      const IconComponent = card.icon
                      return (
                        <motion.div
                          key={index}
                          className="bg-white rounded-xl shadow-md px-1 py-2 text-center space-y-1 md:space-y-2"
                          variants={hoverScale}
                          initial="initial"
                          whileHover="hover"
                        >
                          <div className="mx-auto w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[rgba(246,223,183,1)]">
                            <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-black" />
                          </div>
                          <h3 className="text-base md:text-lg font-bold text-gray-900">{card.title}</h3>
                          <p className="text-xs md:text-sm text-gray-600">{card.subtitle}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* -------------------  TESTIMONIALS (NEW SECTION)  ------------------- */}
        <motion.section
          id="testimonials"
          className="py-24 md:py-32 bg-[rgba(180,177,170,1)] text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
          variants={fadeInUp}
        >
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-16 text-center">
              Das berichten unsere <span className="text-[#D4C6A6]">erfolgreichen</span> Salon-Inhaber:innen
            </h2>

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  quote:
                    "Dank des Mentorings konnte ich meine Preise um 30 % erhöhen – und meine Stammkundschaft hat noch mehr Vertrauen in meine Arbeit gewonnen.",
                  name: "Anna S.",
                  role: "Saloninhaberin, Hamburg",
                },
                {
                  quote:
                    "Unsere Prozesse sind jetzt klar definiert: Wir haben 20 % mehr Termine pro Woche und deutlich weniger Ausfälle.",
                  name: "Marco L.",
                  role: "Barber-Shop-Owner, Berlin",
                },
                {
                  quote:
                    "Durch die Personalstrategien habe ich endlich ein Team, das selbstständig arbeitet und sich weiterentwickelt.",
                  name: "Julia K.",
                  role: "Beauty-Studio, München",
                },
              ].map((t, idx) => (
                <motion.div
                  key={idx}
                  className="bg-black/20 backdrop-blur-sm rounded-xl p-8 border border-white/20 flex flex-col"
                  variants={!isMobile ? hoverScale : undefined}
                  initial={!isMobile ? "initial" : undefined}
                  whileHover={!isMobile ? "hover" : undefined}
                >
                  <p className="text-white/90 italic text-lg flex-grow">{`"${t.quote}"`}</p>

                  <div className="flex items-center mt-6 pt-6 border-t border-white/10">
                    <Image
                      src="/placeholder.svg?height=100&width=100"
                      alt={t.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                      style={{ color: "transparent" }} // ✅ object notation
                    />
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-white/70">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* -------------------  FAQ SECTION ------------------- */}
        <motion.section
          id="faq"
          className="py-24 md:py-32 bg-[#b4b1aa]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
          variants={fadeInUp}
        >
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-white">
                Häufig gestellte <span className="text-[#D4C6A6]">Fragen</span>
              </h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <FAQAccordion />
            </div>
          </div>
        </motion.section>

        {/* -------------------  FINAL FOOTER CTA  ------------------- */}
        <motion.section
          id="kontakt"
          className="py-24 md:py-32 bg-[#a09a93] relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: isMobile ? 0.2 : 0.25 }}
          variants={fadeInUp}
        >
          {/* decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2C2C2C]/30 via-transparent to-transparent" />

          <div className="container px-4 md:px-6 relative z-10 mx-auto max-w-6xl">
            <div className="max-w-5xl mx-auto bg-black/20 backdrop-blur-lg rounded-2xl p-1 border border-white/10 shadow-2xl">
              <div className="bg-gradient-to-br from-[#2c2c2c] to-[#3a3a3a] rounded-xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* --- LEFT: Heading & contact options --- */}
                  <div className="flex flex-col justify-start pt-4">
                    <h2 className="text-3xl md:text-4xl tracking-tight mb-4 text-white">
                      Bereit für den <span className="text-[#D4C6A6]">nächsten Schritt?</span>
                    </h2>

                    <p className="text-lg text-white/70 mb-8">
                      Fülle das Formular aus oder rufe mich direkt an. Ich freue mich darauf, deine Ideen zu hören und
                      zu sehen, wie wir deinen Salon zu einer Top-Marke machen können.
                    </p>

                    <div className="space-y-6">
                      {/* Phone */}
                      <a href="tel:+491743091973" className="flex items-center group transition-all duration-300">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#D4C6A6]/20 transition-colors duration-300">
                          <PhoneCall className="w-5 h-5 text-[#D4C6A6]" />
                        </div>
                        <div>
                          <span className="block text-sm text-white/60">Telefon</span>
                          <span className="text-lg font-medium text-white group-hover:text-[#D4C6A6] transition-colors">
                            +49&nbsp;174&nbsp;3091973
                          </span>
                        </div>
                      </a>

                      {/* Mail */}
                      <a
                        href="mailto:salon@diebianco.de"
                        className="flex items-center group transition-all duration-300"
                      >
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-[#D4C6A6]/20 transition-colors duration-300">
                          <ClipboardList className="w-5 h-5 text-[#D4C6A6]" />
                        </div>
                        <div>
                          <span className="block text-sm text-white/60">E-Mail</span>
                          <span className="text-lg font-medium text-white group-hover:text-[#D4C6A6] transition-colors">
                            salon@diebianco.de
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* --- RIGHT: Simple contact form (static) --- */}
                  <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                          Name
                        </label>
                        <input
                          id="name"
                          name="firstname"
                          required
                          placeholder="Ihr Name"
                          className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white placeholder-white/50
               focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          type="text"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                          E-Mail
                        </label>
                        <input
                          id="email"
                          name="email"
                          required
                          placeholder="Ihre E-Mail"
                          className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white placeholder-white/50
               focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
                          type="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                        Telefon
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        required
                        placeholder="+49 …"
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white placeholder-white/50 resize-none
             focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 transition-all"
                        type="tel"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                        Nachricht
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Ihre Nachricht an uns"
                        className="w-full px-4 py-3 rounded-md border border-white/10 bg-black/20 text-white placeholder-white/50 resize-none
             focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-black/30 backdrop-blur-sm text-white px-6 py-3 rounded-md
           hover:bg-black/40 transition-colors duration-300 focus:outline-none
           focus:ring-2 focus:ring-white/50 focus:ring-offset-2 font-medium"
                    >
                      Nachricht senden
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* -------------------  FOOTER  ------------------- */}
        <footer className="bg-[#2C2C2C] text-white">
          <div className="container px-4 md:px-6 py-16 mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Column 1: Logo & blurb */}
              <div>
                <Image
                  src="/Element1.png" // Updated image source
                  alt="DIE BIANCO MENTORING"
                  width={260}
                  height={90}
                  className="h-16 w-auto object-contain mb-4 max-w-full"
                />
                <p className="text-white/70 leading-relaxed">
                  Dein Mentoring für höhere Preise und nachhaltigen Erfolg in der Beauty-Branche.
                </p>
              </div>

              {/* Column 2: Navigation */}
              <div>
                <h3 className="text-lg mb-4 text-[#D4C6A6]">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#ausbildung"
                      onClick={(e) => {
                        e.preventDefault() // Prevent default hash navigation
                        document.getElementById("ausbildung")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="text-white/70 hover:text-white"
                    >
                      Warum Mentoring?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#moment-cards" // Updated href to new ID
                      onClick={(e) => {
                        e.preventDefault() // Prevent default hash navigation
                        document.getElementById("moment-cards")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="text-white/70 hover:text-white"
                    >
                      Philosophie
                    </a>
                  </li>
                  <li>
                    <a href="#ablauf" className="text-white/70 hover:text-white">
                      Ablauf
                    </a>
                  </li>
                  <li>
                    <a
                      href="#kunden" // Updated href to point to the DARK THEME (BIO) section
                      onClick={(e) => {
                        e.preventDefault() // Prevent default hash navigation
                        document.getElementById("kunden")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="text-white/70 hover:text-white"
                    >
                      Über Mich
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Legal */}
              <div>
                <h3 className="text-lg mb-4 text-[#D4C6A6]">Rechtliches</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/impressum" className="text-white/70 hover:text-white">
                      Impressum
                    </a>
                  </li>
                  <li>
                    <a href="/datenschutz" className="text-white/70 hover:text-white">
                      Datenschutz
                    </a>
                  </li>
                  <li>
                    <a href="/agb" className="text-white/70 hover:text-white">
                      AGB
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
              <p>© {new Date().getFullYear()} DIE BIANCO MENTORING. Alle Rechte vorbehalten.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
