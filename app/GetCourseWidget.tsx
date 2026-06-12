"use client";

import { useEffect, useRef } from "react";

type GetCourseWidgetProps = {
  scriptId: string;
  widgetId: string;
  className?: string;
};

export default function GetCourseWidget({ scriptId, widgetId, className = "" }: GetCourseWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    container.replaceChildren();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://agkedu.getcourse.ru/pl/lite/widget/script?id=${widgetId}`;
    script.async = true;

    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [scriptId, widgetId]);

  return <div className={`gc-widget-slot ${className}`} ref={containerRef} />;
}
