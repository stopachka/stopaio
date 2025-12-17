"use client";

import ActiveCounter from "@/app/ActiveCounter";
import clientDB from "@/lib/instantClient";
import { toHTML } from "@/lib/markdown";
import Head from "next/head";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";

function msToFriendlyStr(ms: number) {
  const d = new Date(ms);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Post() {
  const params = useParams();
  const { data: result } = clientDB.useSuspenseQuery({
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
