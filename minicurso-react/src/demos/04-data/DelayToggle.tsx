// BOM — switch do atraso aleatório (200–1500ms) usado p/ provocar race condition.
import { useState } from "react";
import { isDelayEnabled, setDelayEnabled } from "./api";

export function DelayToggle() {
  const [on, setOn] = useState(isDelayEnabled());

  return (
    <label className="muted" style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => {
          setDelayEnabled(e.target.checked);
          setOn(e.target.checked);
        }}
      />
      atraso aleatório 200–1500ms
    </label>
  );
}
