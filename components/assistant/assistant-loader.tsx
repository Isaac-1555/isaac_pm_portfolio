"use client";

import dynamic from "next/dynamic";

const AssistantRoot = dynamic(
  () => import("./assistant-root").then((module) => module.AssistantRoot),
  { ssr: false },
);

export function AssistantLoader() {
  return <AssistantRoot />;
}
