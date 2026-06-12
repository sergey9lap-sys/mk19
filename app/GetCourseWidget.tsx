"use client";

import { type MouseEvent, useRef } from "react";

type GetCourseWidgetProps = {
  scriptId: string;
  widgetId: string;
  className?: string;
};

export default function GetCourseWidget({ scriptId, widgetId, className = "" }: GetCourseWidgetProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const slot = slotRef.current;
    const trigger = slot?.querySelector<HTMLElement>(
      "button, a, input[type='button'], input[type='submit'], [role='button'], div[onclick]",
    );

    if (trigger && trigger !== document.activeElement) {
      trigger.click();
    }
  };

  return (
    <div className={`gc-widget-slot ${className}`} onClick={handleClick} ref={slotRef}>
      <span className="gc-widget-label">Выбрать тариф</span>
      <script id={scriptId} src={`https://agkedu.getcourse.ru/pl/lite/widget/script?id=${widgetId}`} async />
    </div>
  );
}
