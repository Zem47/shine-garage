"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent, ReactNode } from "react";

export function TransitionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const isBackNavigation = href === "/" || href.startsWith("/#");
    const entryDirection = isBackNavigation ? "from-left" : "from-right";
    const exitClass = isBackNavigation
      ? "page-transition-out-right"
      : "page-transition-out-left";

    window.sessionStorage.setItem(
      "shine-garage-transition-direction",
      entryDirection,
    );
    const page = document.querySelector(".page-transition");
    page?.classList.add(exitClass);

    window.setTimeout(() => {
      router.push(href);
    }, 480);
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
