import { useEffect, useRef } from "react";

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export default function TextBox({ value, onChange }) {
  const ref = useRef(null);

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
  }, [value]);

  return (
    <p
      ref={ref}
      // inputMode="none"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange(normalizeNewlines(e.currentTarget.innerText))}
      className="
        border-none
        outline-none
        bg-secondary
        focus:bg-transparent
        transition-colors
        duration-300
        ease-in-out
        w-full
        h-full
        py-8
        px-4
        rounded-lg
      "
    />
  );
}