"use client";

import clientDB from "@/lib/instantClient";

export default function ActiveCounter() {
  const room = clientDB.room("pages", "all");
  const { peers } = clientDB.rooms.usePresence(room);
  const numActive = Object.values(peers).length + 1;
  return (
    <div className="text-gray-500 text-sm italic">
      Active readers: {numActive}{" "}
    </div>
  );
}
