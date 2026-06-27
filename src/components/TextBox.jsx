import { useEffect, useRef } from "react";

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export default function TextBox({
  value,
  onChange,
  placeholder = "Start writing...",
}) {
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
      data-placeholder={placeholder}
      suppressContentEditableWarning
      onInput={(e) => onChange(normalizeNewlines(e.currentTarget.innerText))}
      className={`
        border-none
        outline-none
        bg-b2
        focus:bg-transparent
        transition-all
        duration-300
        ease-in-out
        w-full
        h-full
        focus:py-8
        py-4
        px-4
        rounded-lg
        textbox-editable
        ${value ? "" : "textbox-empty"}
      `}
    />
  );
}