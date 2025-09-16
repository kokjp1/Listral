"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      // Keep the toaster above modals/sheets so clicks work
      className={["z-[100000] pointer-events-auto", props.className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
