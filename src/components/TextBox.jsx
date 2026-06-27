import { useEffect, useRef } from "react";

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function scrollToBottom(target) {
  const scrollingElement =
    document.scrollingElement || document.documentElement || document.body;

  const runScroll = () => {
    target?.scrollIntoView({ block: "end", inline: "nearest" });

    const maxScrollTop = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      scrollingElement.scrollHeight
    );

    window.scrollTo(0, maxScrollTop);
    scrollingElement.scrollTop = maxScrollTop;
    document.documentElement.scrollTop = maxScrollTop;
    document.body.scrollTop = maxScrollTop;
  };

  // iOS Safari may need repeated attempts while keyboard/viewport settles.
  runScroll();
  requestAnimationFrame(runScroll);
  setTimeout(runScroll, 120);
  setTimeout(runScroll, 260);
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
        onInput={(e) => {
          const newText = normalizeNewlines(e.currentTarget.innerText);
          const oldText = lastTextRef.current;
          const isAppendOnly =
            newText.length > oldText.length && newText.startsWith(oldText);

          onChange(newText);

          if (isAppendOnly) {
            scrollToBottom(ref.current);
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