import Link from "next/link";
import React from "react";
import Linkify from "linkify-react";
import { cn } from "@/lib/utils";

interface optionsType {
  className?: string;
}

const _def = {
  className: "text-blue-500 hover:opacity-80",
};

// content: string (解析するテキスト)
const customLinkify = (content?: string, options?: optionsType) => {
  return (
    <Linkify
      options={{
        render: {
          url: ({ attributes, content }) => {
            return (
              <a
                className={cn(_def.className, options?.className)}
                target="_blank"
                rel="noopener noreferrer"
                {...attributes}
              >
                {content}
              </a>
            );
          },
          mention: ({ attributes, content }) => {
            const { href, ...props } = attributes;
            return (
              <Link
                href={href}
                className={cn(_def.className, options?.className)}
                {...props}
              >
                {content}
              </Link>
            );
          },
        },
      }}
    >
      {content}
    </Linkify>
  );
};

export default customLinkify;
