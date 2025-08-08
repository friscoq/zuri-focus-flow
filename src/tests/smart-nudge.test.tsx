import { describe, it, expect, beforeEach } from "vitest"
import React from "react"
import { render } from "@testing-library/react"
import { NudgeProvider, useNudges } from "@/contexts/NudgeContext"
import { SmartNudgeCenter } from "@/components/SmartNudge"

function Wrapper({ children }: { children: React.ReactNode }) {
  return <NudgeProvider>{children}</NudgeProvider>
}

function EnqueueBtn({ text, id }: { text: string; id?: string }) {
  const { enqueue } = useNudges()
  return (
    <button onClick={() => enqueue({ id, nudgeText: text, nudgeType: "suggestion" })}>add</button>
  )
}

describe("Nudges", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("queues up to 3 (FIFO) with debounce", async () => {
    const { getAllByText, getAllByRole } = render(
      <Wrapper>
        <EnqueueBtn text="a" />
        <EnqueueBtn text="b" />
        <EnqueueBtn text="c" />
        <EnqueueBtn text="d" />
        <SmartNudgeCenter renderAll />
      </Wrapper>
    )

    const btns = getAllByText("add")
    btns[0].click()
    btns[1].click()
    btns[2].click()
    btns[3].click()

    await new Promise((r) => setTimeout(r, 600))

    // Should keep last 3 only
    const notes = getAllByRole("note")
    expect(notes.length).toBe(3)
  })

  it("dismisses a nudge and remembers it", async () => {
    const { getByText, queryAllByRole, getByLabelText } = render(
      <Wrapper>
        <EnqueueBtn text="persist" id="persist-1" />
        <SmartNudgeCenter renderAll />
      </Wrapper>
    )

    getByText("add").click()
    await new Promise((r) => setTimeout(r, 600))

    const dismiss = getByLabelText(/dismiss nudge/i)
    dismiss.click()

    // Re-enqueue should not show because marked dismissed
    getByText("add").click()
    await new Promise((r) => setTimeout(r, 600))

    const notes = queryAllByRole("note")
    expect(notes.length).toBe(0)
  })
})
