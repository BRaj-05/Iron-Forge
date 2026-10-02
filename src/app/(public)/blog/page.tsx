import Link from "next/link";
import PublicPageShell from "@/components/home/PublicPageShell";
import FadeInSection from "@/components/motion/FadeInSection";
import Card from "@/components/ui/Card";
import { blogPosts } from "@/lib/public-content";

export default function BlogPage() {
  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">Tips & Guides</p>
        <h1 className="if-title">Short fitness notes for better weekly habits.</h1>
        <p className="if-copy">
          Original Iron Forge guide copy for training, diet logging, cardio,
          and consistency. No scraped content, no fake expert claims.
        </p>
      </section>

      <FadeInSection className="if-section" style={{ paddingTop: 0 }}>
        <div className="if-grid">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
              <Card>
                <span className="if-tag">{post.readTime}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </Card>
            </Link>
          ))}
        </div>
      </FadeInSection>
    </PublicPageShell>
  );
}
