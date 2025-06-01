"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next/client";
import { verifySession } from "./_c/verify";
import { IconLoader2 } from "@tabler/icons-react";

function CO() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<string | null>(null);

  useEffect(() => {
    const _session = searchParams.get("privateCode");
    setSession(_session);
  }, [searchParams]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
      return;
    }

    const c = async () => {
      const res = await verifySession(session);
      if (res.success) {
        setCookie("_sauth-token", res.data.token);
      }
      router.replace("/");
      return;
    };

    c();
  }, [session]);

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
