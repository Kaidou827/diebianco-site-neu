
import BlogNavigation from "@/components/BlogNavigation"

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[rgba(180,177,170,1)] text-white">
      <BlogNavigation />
      <main className="min-h-screen bg-[rgba(180,177,170,1)] text-white">
        {children}
      </main>
    </div>
  )
}
