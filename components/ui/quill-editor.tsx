"use client";

import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import type QuillType from "quill"; // type-only import is safe on SSR
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  defaultValue?: string; // HTML string
  readOnly?: boolean;
  onTextChange?: (...args: any[]) => void;
  onSelectionChange?: (...args: any[]) => void;
  toolbar?: any; // Optional custom toolbar configuration
}

const QuillEditor = forwardRef<QuillType | null, QuillEditorProps>(
  (
    {
      readOnly = false,
      defaultValue,
      onTextChange,
      onSelectionChange,
      toolbar,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const isInitializedRef = useRef(false);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    // toggle readOnly after init
    useEffect(() => {
      if (typeof ref === "function") return;
      ref?.current?.enable?.(!readOnly);
    }, [ref, readOnly]);

    // update content if defaultValue changes
    useEffect(() => {
      if (typeof ref === "function") return;
      if (
        ref?.current &&
        isInitializedRef.current &&
        defaultValue !== undefined
      ) {
        const current = ref.current.root.innerHTML.trim();
        const next = defaultValue || "";
        if (current !== next) ref.current.root.innerHTML = next;
      }
      defaultValueRef.current = defaultValue;
    }, [defaultValue, ref]);

    useEffect(() => {
      let quill: QuillType | null = null;
      let destroyed = false;

      (async () => {
        // ✅ dynamic import — only runs in the browser
        const { default: Quill } = await import("quill");

        if (destroyed || !containerRef.current) return;

        const editorContainer = containerRef.current.appendChild(
          document.createElement("div")
        );

        const defaultToolbar = [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ];

        quill = new Quill(editorContainer, {
          theme: "snow",
          readOnly,
          modules: {
            toolbar: toolbar || defaultToolbar,
          },
        });

        // expose via ref
        if (typeof ref === "function") ref(quill);
        else if (ref) (ref as any).current = quill;

        isInitializedRef.current = true;

        // set initial HTML
        if (defaultValueRef.current) {
          quill.root.innerHTML = defaultValueRef.current;
        }

        // use event names (avoids touching Quill.events)
        quill.on("text-change", (...args: any[]) => {
          onTextChangeRef.current?.(...args);
        });
        quill.on("selection-change", (...args: any[]) => {
          onSelectionChangeRef.current?.(...args);
        });
      })();

      return () => {
        destroyed = true;
        isInitializedRef.current = false;
        if (typeof ref === "function") ref(null);
        else if (ref) (ref as any).current = null;
        if (containerRef.current) containerRef.current.innerHTML = "";
      };
    }, [ref, readOnly]);

    return <div ref={containerRef} />;
  }
);

QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
