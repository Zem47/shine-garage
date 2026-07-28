"use client";

import { useEffect, useRef } from "react";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedDirection = window.sessionStorage.getItem(
      "shine-garage-transition-direction",
    );
    const direction =
      savedDirection === "from-left" ? "from-left" : "from-right";

    window.sessionStorage.removeItem("shine-garage-transition-direction");
    pageRef.current?.classList.add(`page-transition-${direction}`);
    const frame = window.requestAnimationFrame(() => {
      pageRef.current?.classList.add("page-transition-ready");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={pageRef} className="page-transition">
      {children}
    </div>
  );
}
