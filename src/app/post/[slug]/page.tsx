import { toHTML } from "@/lib/markdown";
import { redirect } from "next/navigation";
import adminDB from "@/lib/instantAdmin";
import Link from "next/link";
import ActiveCounter from "@/app/ActiveCounter";

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  const { posts } = await adminDB.query({ posts: {} });
  return posts.map((post) => ({
    slug: post.number,
  }));
}

function msToFriendlyStr(ms: number) {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const {
    posts: [post],
  } = await adminDB.query({
    posts: {
      $: { where: { number: +params.slug } },
    },
  });
  return {
    title: post.title || `Stepan Parunashvili`,
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const result = await adminDB.query({
    posts: {
      $: { where: { number: +params.slug } },
      body: {},
    },
  });
  const [post] = result.posts;
  if (!post) {
    redirect("/404");
  }
  const html = toHTML(post.body!.markdown);
  return (
    <div>
      <header className="mb-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <Link href="/" className="text-black visited:text-black font-bold">
            Stepan <span className="hidden md:inline">Parunashvili</span>
          </Link>
          <Link href="https://instantdb.com" target="_blank">
            Instant
          </Link>
          <Link href="https://twitter.com/stopachka" target="_blank">
            Twitter
          </Link>
        </div>
        <div>
          <ActiveCounter />
        </div>
      </header>
      <div className="prose prose-h1:mt-8 prose-h1:mb-4 prose-h2:mt-4 prose-h2:mb-2 mx-auto">
        <h1>{post.title}</h1>
        <div className="text-gray-500 text-sm">
          {msToFriendlyStr(post.createdAt)}
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="text-gray-500 italic text-center">
          Powered by <a href="https://instantdb.com">Instant</a>
        </div>
      </div>
    </div>
  );
}
