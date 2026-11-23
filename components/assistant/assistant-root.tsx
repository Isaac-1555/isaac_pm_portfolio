"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { Eye } from "./eye";
import { useActiveSection } from "./use-active-section";
import { useAssistant } from "./use-assistant";
import { useAssistantSound } from "./use-assistant-sound";

const ChatPanel = dynamic(
  () => import("./chat-panel").then((module) => module.ChatPanel),
  { ssr: false },
);

export function AssistantRoot() {
  const section = useActiveSection();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const assistant = useAssistant(section);
  const sound = useAssistantSound(assistant.state === "ready");

  const preloadPanel = useCallback(() => {
    void import("./chat-panel");
  }, []);

  return (
    <>
      <Eye
        state={assistant.state}
        progress={assistant.progress}
        panelOpen={assistant.panelOpen}
        sectionId={section}
        canPreload={assistant.canPreload}
        onWake={() => {
          preloadPanel();
          assistant.wake();
        }}
        onOpen={() => {
          preloadPanel();
          assistant.openPanel();
        }}
        onBootComplete={assistant.onBootComplete}
        buttonRef={buttonRef}
      />
      {assistant.hasOpened ? (
        <ChatPanel
          open={assistant.panelOpen}
          state={assistant.state}
          status={assistant.status}
          mode={assistant.mode}
          progress={assistant.progress}
          messages={assistant.messages}
          chips={assistant.chips}
          chipsLabel={assistant.chipsLabel}
          bootLog={assistant.bootLog}
          muted={sound.muted}
          onToggleSound={sound.toggle}
          returnFocusRef={buttonRef}
          onClose={assistant.closePanel}
          onAsk={assistant.ask}
          onStreamComplete={assistant.onStreamComplete}
        />
      ) : null}
    </>
  );
}
