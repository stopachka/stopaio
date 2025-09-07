"use client";

import clientDB from "@/lib/instantClient";
import { tx, id } from "@instantdb/admin";
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
        const isDraft = target.isDraft.checked;
        await clientDB.transact([
          tx.posts[post.id].update({ title, isDraft }),
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
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="isDraft"
          defaultChecked={post.isDraft || false}
        />
        <span>Draft</span>
      </label>
      <button className="block bg-blue-100 w-full p-2 bold">Save</button>
    </form>
  );
}

function CreatePost({ nextNumber }: { nextNumber: number }) {
  const { user } = clientDB.useAuth();
  const [isDraft, setIsDraft] = useState(true);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  
  return (
    <form
      className="space-y-2"
      onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const postId = id();
        const bodyId = id();
        const now = Date.now();
        await clientDB.transact([
          tx.posts[postId].create({ 
            title, 
            number: nextNumber,
            isDraft,
            createdAt: now,
            updatedAt: now
          }),
          tx.postBodies[bodyId].create({ markdown }),
          tx.posts[postId].link({ body: bodyId }),
        ]);
        const res = await bustNext(user!.refresh_token);
        alert(`🫡 ${res.status}`);
        setTitle("");
        setMarkdown("");
        setIsDraft(true);
      }}
    >
      <h2 className="font-bold">Create New Post</h2>
      <input
        name="title"
        className="block w-full p-2 border"
        placeholder="Enter title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        name="markdown"
        className="block w-full p-2 h-96 border"
        placeholder="Write your post content here..."
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isDraft}
          onChange={(e) => setIsDraft(e.target.checked)}
        />
        <span>Draft</span>
      </label>
      <button className="block bg-blue-100 w-full p-2 bold">Create Post</button>
    </form>
  );
}

function Editor() {
  const { isLoading, error, data } = clientDB.useQuery({ posts: {} });
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  if (isLoading) return <div>...</div>;
  if (error) return <div>{error.message}</div>;
  
  const maxNumber = data.posts.reduce((max, post) => 
    Math.max(max, post.number || 0), 0);
  const nextNumber = maxNumber + 1;
  
  return (
    <div className="flex font-sans">
      <div className="max-w-xs flex flex-col space-y-1 border-r">
        <button
          className={`text-left hover:bg-gray-100 block p-2 font-bold
              ${showCreate ? "bg-gray-100" : ""}`}
          onClick={() => {
            setShowCreate(true);
            setActivePostId(null);
          }}
        >
          + Create New Post
        </button>
        <div className="border-b" />
        {data.posts
          .toSorted((a, b) => b.number - a.number)
          .map((post) => {
            return (
              <button
                key={post.id}
                className={`text-left hover:bg-gray-100 block p-2 
                    ${activePostId === post.id ? "bg-gray-100" : ""}`}
                onClick={() => {
                  setActivePostId(post.id);
                  setShowCreate(false);
                }}
              >
                {post.title}
                {post.isDraft && <span className="text-gray-500 text-sm ml-2">(Draft)</span>}
              </button>
            );
          })}
      </div>
      <div className="flex-1 px-4 max-w-lg">
        {showCreate ? (
          <CreatePost nextNumber={nextNumber} />
        ) : activePostId ? (
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
