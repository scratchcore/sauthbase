"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { verifySession } from "./verify";

function CO() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session = searchParams.get("privateCode");

    if (!session) {
      router.replace("/");
      return;
    }

    const c = async () => {
      const res = await verifySession(session);
      router.replace("/");
      return;
    };

    c();
  }, []);

  return (
    <div className="fixed flex justify-center items-center w-full h-dvh">
      <IconLoader2 size={40} className="animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <CO />
    </Suspense>
  );
}
