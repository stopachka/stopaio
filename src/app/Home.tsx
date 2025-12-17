"use client";

import ActiveCounter from "@/app/ActiveCounter";

import clientDB from "@/lib/instantClient";
import Link from "next/link";

export default function Home() {
  const {
    data: { posts },
  } = clientDB.useSuspenseQuery({
    posts: { $: { fields: ["id", "number", "title", "isDraft"] } },
  });
  const orderedPosts = posts
    .toSorted((a, b) => b.number - a.number)
    .filter((p) => !p.isDraft);
  return (
    <div>
      <header className="mb-2 flex justify-between items-center">
        <div className="flex space-x-2 font-bold">
          <Link href="/" className="text-black visited:text-black">
            Stepan Parunashvili
          </Link>
        </div>
        <div>
          <ActiveCounter />
        </div>
      </header>
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-gray-500">My startup</h2>
          <p>
            <span>
              <Link href="https://instantdb.com" target="_blank">
                Instant
              </Link>
              : Build real-time and offline apps
            </span>
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="text-gray-500">Projects</h2>
          <p>
            <Link href="https://consistent.fit" target="_blank">
              Consistent
            </Link>
            : Make fitness part of your identity
          </p>
          <p>
            <Link href="https://zeneca.io" target="_blank">
              Zeneca
            </Link>
            : Share your favorite books
          </p>
          <p>
            <Link href="https://jobsearch.dev" target="_blank">
              Jobsearch.dev
            </Link>
            : Senior and staff interview prep
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="text-gray-500">Socials</h2>
          <p>
            <Link href="https://twitter.com/stopachka" target="_blank">
              Twitter
            </Link>
          </p>
          <p>
            <Link href="https://zeneca.io/stopa" target="_blank">
              Favorite books
            </Link>
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="text-gray-500">Essays</h2>
          <div className="space-y-4">
            {orderedPosts.map((post) => {
              return (
                <div key={post.id}>
                  <Link
                    href={`/post/${post.number}`}
                    className="underline"
                    onMouseOver={(e) => {
                      console.log("YAAAU");
                    }}
                  >
                    {post.title}
                  </Link>
                  {post.isDraft && (
                    <span className="text-gray-500 text-sm ml-2">(Draft)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
