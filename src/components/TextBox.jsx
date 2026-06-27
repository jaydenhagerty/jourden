import { useEffect, useRef } from "react";

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight });
}

export default function TextBox({
  value,
  onChange,
  placeholder = "Start writing...",
}) {
  const ref = useRef(null);
  const lastTextRef = useRef(normalizeNewlines(value ?? ""));

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!ref.current) return;
      ref.current.focus();

      const selection = window.getSelection();
      if (!selection) return;

      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    });

    return () => cancelAnimationFrame(id);
  }, []);

  // sync external value -> DOM
  useEffect(() => {
    if (!ref.current) return;
    if (normalizeNewlines(ref.current.innerText) !== normalizeNewlines(value)) {
      ref.current.innerText = value;
    }

    lastTextRef.current = normalizeNewlines(value ?? "");
  }, [value]);

  return (
    <div className="w-full max-w-[1200px] text-3xl">
      <p
        ref={ref}
        // inputMode="none"
        contentEditable
        data-placeholder={placeholder}
        suppressContentEditableWarning
        // onFocus={scrollToBottom}
        onInput={(e) => {
          const newText = normalizeNewlines(e.currentTarget.innerText);
          const oldText = lastTextRef.current;
          const isAppendOnly =
            newText.length > oldText.length && newText.startsWith(oldText);

          onChange(newText);

          if (isAppendOnly) {
            scrollToBottom();
          }

          lastTextRef.current = newText;
        }}
        className={`
          border-none
          outline-none
          transition-all
          duration-300
          ease-in-out
          w-full
          h-full
          p-4
          rounded-lg
          textbox-editable
          ${value ? "" : "textbox-empty"}
        `}
      />
    </div>
  );
}