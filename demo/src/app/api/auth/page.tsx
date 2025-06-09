"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";
import { verifySession } from "./verify";
import { toast } from "sonner";

function CO() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const session = searchParams.get("privateCode");

    if (!session) {
      toast.error("認証コードが見つかりませんでした");
      router.replace("/");
      return;
    }

    const c = () => {
      const promise = verifySession(session);

      toast.promise(promise, {
        loading: "認証を確認しています...",
        success: "認証に成功しました",
        error: "認証に失敗しました",
      });

      promise.finally(() => {
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      });
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
