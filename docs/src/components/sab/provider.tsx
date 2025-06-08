"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconUser } from "@tabler/icons-react";
import { toast } from "sonner";
import { APIResult, userInfoProps } from "sauthbase/types";
import { serverGetUser, serverGetUserInfo, serverLogout } from "./main";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const sabc = createContext<null | userInfoProps>(null);

export function SabProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<null | userInfoProps>(null);
  const [loading, _setLoading] = useState<{ [key: string]: boolean }>({
    user: false,
    logout: false,
  });
  const setLoading = (val: { [key: string]: boolean }) => {
    _setLoading({
      ...loading,
      ...val,
    });
  };
  const [_dialog, _setDialog] = useState<{ [key: string]: boolean }>({
    logout: false,
  });
  const setDialog = (val: { [key: string]: boolean }) => {
    _setDialog({
      ..._dialog,
      ...val,
    });
  };

  const reload = async (): Promise<APIResult<userInfoProps>> => {
    const _user = await serverGetUser();
    if (_user.success === true) {
      const _userInfo = await serverGetUserInfo(_user.data);
      if (_userInfo.success === true) {
        setUser(_userInfo.data);
        return { ..._userInfo, data: _userInfo.data };
      } else {
        return _userInfo;
      }
    } else {
      return _user;
    }
  };

  // 初期ロード
  useEffect(() => {
    const fetchUser = async () => {
      setLoading({ user: true });

      try {
        const resultPromise = reload().then((result) => {
          if (result.success === true) {
            return result.data;
          } else {
            console.log(result.code);
            const _if =
              result.code === "ERROR/ARGUMENT_REQUIRED_SESSION" ||
              result.code === "ERROR/ARGUMENT_REQUIRED_TOKEN";
            if (!_if) {
              toast.error("ログインに失敗しました。", {
                description: result.message,
              });
            }
            toast("ログインしますか？", {
              action: {
                label: "ログイン",
                onClick: login,
              },
            });
          }
        });

        toast.promise(resultPromise, {
          loading: "ユーザー情報を取得中...",
          success: (u) =>
            u ? `${u.username} でログインしています。` : "ゲストモードです",
          error: "ログインに失敗しました。",
        });
      } finally {
        setLoading({ user: false });
      }
    };

    fetchUser();
  }, []);

  const login = () => {
    router.push("/api/login");
  };

  const logout = () => {
    const ac = async () => {
      await serverLogout();
      window.location.reload();
    };
    ac();
  };

  return (
    <sabc.Provider value={user}>
      <div className="fixed z-[9000] bottom-[20px] right-[20px]">
        {loading.user ? (
          <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 p-1 rounded-full animate-pulse">
            <IconUser className="" />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 p-1 rounded-full">
                <IconUser className="" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>{user?.username || "Guest"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem onClick={() => setDialog({ logout: true })}>
                  Log out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={login}>Log In</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <Dialog
        open={_dialog?.logout}
        onOpenChange={(val) => setDialog({ logout: val })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>本当にログアウトしますか？</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialog({ logout: false });
              }}
            >
              キャンセル
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDialog({ logout: false }), logout();
              }}
            >
              ログアウトする
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </sabc.Provider>
  );
}
