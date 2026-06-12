"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type GetCourseWidgetProps = {
  widgetId: string;
  className?: string;
};

function getWidgetUrl(widgetId: string) {
  const params = new URLSearchParams(window.location.search);

  params.set("id", widgetId);
  params.set("ref", document.referrer);
  params.set("loc", window.location.href);

  try {
    if (window.clrtQueryData) {
      params.set("clrtQueryData", JSON.stringify(window.clrtQueryData));
    }
  } catch {}

  return `https://agkedu.getcourse.ru/pl/lite/widget/widget?${params.toString()}`;
}

declare global {
  interface Window {
    clrtQueryData?: unknown;
  }
}

export default function GetCourseWidget({ widgetId, className = "" }: GetCourseWidgetProps) {
  const [widgetUrl, setWidgetUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const isOpen = Boolean(widgetUrl);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setWidgetUrl("");
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        className={`gc-widget-slot ${className}`}
        onClick={() => setWidgetUrl(getWidgetUrl(widgetId))}
        type="button"
        aria-haspopup="dialog"
      >
        <span className="gc-widget-label">Выбрать тариф</span>
      </button>

      {isMounted && isOpen
        ? createPortal(
            <div className="gc-modal" onMouseDown={() => setWidgetUrl("")}>
              <div
                className="gc-modal-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Оплата тарифа"
                onMouseDown={(event) => event.stopPropagation()}
              >
                <button className="gc-modal-close" onClick={() => setWidgetUrl("")} type="button" aria-label="Закрыть">
                  ×
                </button>
                <iframe className="gc-modal-frame" src={widgetUrl} title="Форма оплаты тарифа" />
              </div>
            </div>,
          document.body,
          )
        : null}
    </>
  );
}
