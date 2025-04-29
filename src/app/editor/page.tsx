"use client";

import clientDB from "@/lib/instantClient";
import { tx } from "@instantdb/admin";
import { useEffect, useRef, useState } from "react";

const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  return isHydrated;
};

async function bustNext(refresh_token: string) {
  return fetch("/api/bust", {
    method: "POST",
    headers: { Token: refresh_token },
  });
}

function PostEditor({ id }: { id: string }) {
  const { user } = clientDB.useAuth();
  const { isLoading, error, data } = clientDB.useQuery({
    posts: {
      $: { where: { id } },
      body: {},
    },
  });
  if (isLoading) return <div>...</div>;
  if (error) return <div>{error.message}</div>;
  const post = data.posts[0];
  if (!post) return <div>Post not found</div>;
  const postBody = post.body!;
  return (
    <form
      key={post.id}
      className="space-y-2"
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as any;
        const title = target.title.value;
        const markdown = target.markdown.value;
        await clientDB.transact([
          tx.posts[post.id].update({ title }),
          tx.postBodies[postBody.id].update({ markdown }),
        ]);
        const res = await bustNext(user!.refresh_token);
        alert(`🫡 ${res.status}`);
      }}
    >
      <input
        name="title"
        className="block w-full p-2 border"
        defaultValue={post.title}
      />
      <textarea
        name="markdown"
        className="block w-full p-2 h-96 border"
        defaultValue={postBody.markdown}
      />
      <button className="block bg-blue-100 w-full p-2 bold">Save</button>
    </form>
  );
}

function Editor() {
  const { isLoading, error, data } = clientDB.useQuery({ posts: {} });
  const [activePostId, setActivePostId] = useState<string | null>(null);
  if (isLoading) return <div>...</div>;
  if (error) return <div>{error.message}</div>;
  return (
    <div className="flex font-sans">
      <div className="max-w-xs flex flex-col space-y-1 border-r">
        {data.posts
          .toSorted((a, b) => b.number - a.number)
          .map((post) => {
            return (
              <button
                key={post.id}
                className={`text-left hover:bg-gray-100 block p-2 
                    ${activePostId === post.id ? "bg-gray-100" : ""}`}
                onClick={() => setActivePostId(post.id)}
              >
                {post.title}
              </button>
            );
          })}
      </div>
      <div className="flex-1 px-4 max-w-lg">
        {activePostId ? (
          <PostEditor id={activePostId} />
        ) : (
          <div className="text-gray-600 italic">Pick a post to edit it :)</div>
        )}
      </div>
    </div>
  );
}

function Login() {
  const [sentEmail, setSentEmail] = useState("");
  return (
    <div>
      {!sentEmail ? (
        <Email setSentEmail={setSentEmail} />
      ) : (
        <MagicCode sentEmail={sentEmail} />
      )}
    </div>
  );
}

function Email({ setSentEmail }: { setSentEmail: Function }) {
  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    if (!email) return;
    setSentEmail(email);
    clientDB.auth.sendMagicCode({ email }).catch((err: any) => {
      alert("Uh oh: " + err.body?.message);
      setSentEmail("");
    });
  };

  return (
    <form className="font-sans max-w-lg space-y-2" onSubmit={handleSubmit}>
      <h2 className="font-bold">Let's log you in!</h2>
      <input
        ref={emailRef}
        key="email"
        type="email"
        placeholder="Enter your email"
        className="p-2 border w-full block"
      />
      <button type="submit" className="bg-blue-100 w-full p-2">
        Send Code
      </button>
    </form>
  );
}

function MagicCode({ sentEmail }: { sentEmail: string }) {
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    codeRef.current?.focus();
  }, []);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = codeRef.current?.value;
    if (!code) return;
    clientDB.auth
      .signInWithMagicCode({ email: sentEmail, code })
      .catch((err: any) => {
        alert("Uh oh: " + err.body?.message);
      });
  };

  return (
    <form className="font-sans max-w-lg space-y-2" onSubmit={handleSubmit}>
      <h2 className="font-bold">
        Okay, we sent you an email! What was the code?
      </h2>
      <input
        ref={codeRef}
        key="code"
        type="text"
        placeholder="123456..."
        className="p-2 border w-full"
      />
      <button type="submit" className="bg-blue-100 w-full p-2">
        Verify
      </button>
    </form>
  );
}

function AuthedEditor() {
  const { isLoading, user, error } = clientDB.useAuth();
  if (isLoading) return <div>...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return <Login />;
  return <Editor />;
}

export default function Page() {
  const isHydrated = useIsHydrated();
  if (!isHydrated) {
    return null;
  }
  return <AuthedEditor />;
}
