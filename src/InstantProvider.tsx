"use client";
import { InstantSuspenseProvider } from "@instantdb/react/nextjs";
import clientDB from "@/lib/instantClient";
import { User } from "@instantdb/core";

export const InstantProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) => (
  <InstantSuspenseProvider user={user} db={clientDB}>
    {children}
  </InstantSuspenseProvider>
);
