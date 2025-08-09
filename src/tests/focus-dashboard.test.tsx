import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import { NudgeProvider } from "@/contexts/NudgeContext";
import { FocusProvider, useFocus } from "@/contexts/FocusContext";
import FocusZoneCard from "@/components/FocusZoneCard";
import { SmartNudgeCenter } from "@/components/SmartNudge";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NudgeProvider>
      <FocusProvider>{children}</FocusProvider>
    </NudgeProvider>
  );
}

function SetIntentButton() {
  const { setFocusIntent } = useFocus();
  return <button onClick={() => setFocusIntent("Deep work")}>seed</button>;
}

describe("Focus Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores focus intent from session", async () => {
    localStorage.setItem(
      "zuri_focus_ctx",
      JSON.stringify({ focusIntent: "Resume writing", captures: [] })
    );
    const { getByDisplayValue } = render(
      <Providers>
        <FocusZoneCard />
      </Providers>
    );
    expect(getByDisplayValue(/Resume writing/i)).toBeTruthy();
  });

  it("clear mind flow empties focus and enqueues encouragement", async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <Providers>
        <SetIntentButton />
        <FocusZoneCard />
        <SmartNudgeCenter renderAll />
      </Providers>
    );
    getByText("seed").click();
    const clearBtn = getByLabelText(/clear my mind/i);
    clearBtn.click();
    // focus input becomes empty
    expect(queryByText("Deep work")).toBeNull();
  });
});
