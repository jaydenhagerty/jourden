import { useEffect, useRef } from "react";

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
    if (ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  return (
    <p
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onChange(e.currentTarget.innerText)}
      className="
        border-none
        outline-none
        w-full
        h-full
        py-20
        px-4
      "
    />
  );
}