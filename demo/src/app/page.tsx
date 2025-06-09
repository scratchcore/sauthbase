"use client";

import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconCalendar,
  IconLoader2,
  IconLogin,
  IconLogout,
  IconRosetteDiscountCheck,
  IconWorldPin,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import customLinkify from "@/components/customLinkify";
import { logout, sabc } from "@/components/sab/provider";

export default function Home() {
  const router = useRouter();
  const { user, loaded } = useContext(sabc);

  function Content() {
    if (user) {
      return (
        <div className="flex flex-col w-full min-h-dvh">
          <div className="flex flex-wrap items-center">
            <img
              className="w-30 h-30 border border-neutral-200 rounded-full shadow-lg"
              alt="Avatar"
              src={user.profile.images["90x90"]}
            />
            <Link
              className="group flex flex-wrap items-end"
              href={`https://scratch.mit.edu/users/${user.username}`}
              target="_blank"
            >
              <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl ml-2 sm:ml-3 md:ml-4 lg:ml-5 mt-5 sm:mt-0">
                {user.username}
              </h1>
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl opacity-60">
                #{user.id}
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-5 mt-5">
            {user.scratchteam && (
              <span className="flex items-center gap-1">
                <IconRosetteDiscountCheck />
              </span>
            )}
            <span className="flex items-center gap-1">
              <IconCalendar />
              {new Date(user.history.joined).toLocaleString("ja-JP")}
            </span>
            <span className="flex items-center gap-1">
              <IconWorldPin />
              {user.profile.country}
            </span>
          </div>
          <Tabs defaultValue="bio" className="mt-5">
            <TabsList>
              <TabsTrigger value="bio">Bio</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>
            <TabsContent value="bio" className="p-3 border rounded-2xl">
              <p className="whitespace-pre-line">
                {customLinkify(user.profile.bio)}
              </p>
            </TabsContent>
            <TabsContent value="status" className="p-3 border rounded-2xl">
              <p className="whitespace-pre-line">
                {customLinkify(user.profile.status)}
              </p>
            </TabsContent>
          </Tabs>
          <hr className="my-10 border-neutral-500" />
          <pre className="group relative max-w-full p-2 border rounded-xl overflow-auto">
            <code>{JSON.stringify(user, null, 2)}</code>
          </pre>
          <hr className="my-10 border-neutral-500" />
          <div>
            <Button
              className="cursor-pointer hover:opacity-80"
              variant="destructive"
              onClick={logout}
            >
              <IconLogout /> ログアウト
            </Button>
          </div>
        </div>
      );
    }
    if (!loaded) {
      return (
        <div className="fixed flex justify-center items-center w-full h-dvh">
          <IconLoader2 size={40} className="animate-spin" />
        </div>
      );
    }
    return (
      <div>
        <Button
          className="cursor-pointer hover:opacity-80"
          variant="outline"
          onClick={() => router.push("/api/login")}
        >
          <IconLogin /> ログイン
        </Button>
      </div>
    );
  }

  return (
    <div>
      <section className="flex flex-col justify-center items-center container max-w-5xl min-h-dvh mx-auto p-5">
        {Content()}
      </section>
    </div>
  );
}
