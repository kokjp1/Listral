"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut } from "lucide-react";
import { signOutAction } from "@/functions/auth"; // 

type UserLike = {
  email: string | null;
  user_metadata?: { full_name?: string; avatar_url?: string };
};

export default function ProfileHeader({ user }: { user: UserLike }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-background/50 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          <img
            src={user.user_metadata?.avatar_url ?? "/default-avatar.png"}
            alt="User avatar"
            className="rounded-full"
          />
          <AvatarFallback className="text-lg">
            {user.email?.[0]?.toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold leading-tight">
            {user.user_metadata?.full_name ?? "Anonymous User"}
          </h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Member</Badge>
            <Badge variant="outline">MVP</Badge>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-md items-center gap-2 sm:w-auto">
        <Input placeholder="Search your library…" className="h-10" />
        <Button className="h-10" variant="secondary" size="icon" aria-label="Settings">
          <Settings className="size-4" />
        </Button>

        {/* ✅ Server Action works from a Client Component via <form action> */}
        <form action={signOutAction}>
          <Button className="h-10" variant="outline" size="icon" aria-label="Sign out" type="submit">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
