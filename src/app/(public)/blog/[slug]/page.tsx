import { notFound } from "next/navigation";
import PublicPageShell from "@/components/home/PublicPageShell";
import Card from "@/components/ui/Card";
import { blogPosts } from "@/lib/public-content";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <PublicPageShell>
      <section className="if-section if-hero-full">
        <p className="if-kicker">{post.readTime}</p>
        <h1 className="if-title">{post.title}</h1>
        <p className="if-copy">{post.excerpt}</p>
      </section>

      <section className="if-section" style={{ paddingTop: 0 }}>
        <Card style={{ maxWidth: 900 }}>
          {post.body.map((paragraph) => (
            <p key={paragraph} style={{ lineHeight: 1.8 }}>{paragraph}</p>
          ))}
        </Card>
      </section>
    </PublicPageShell>
  );
}
