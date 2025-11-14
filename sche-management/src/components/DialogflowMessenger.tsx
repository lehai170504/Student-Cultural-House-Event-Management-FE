"use client";

import { useEffect, useRef } from "react";

export default function DialogflowMessenger() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Dialogflow script
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    // Create and configure df-messenger element
    if (containerRef.current) {
      const messenger = document.createElement("df-messenger");
      messenger.setAttribute("intent", "WELCOME");
      messenger.setAttribute("chat-title", "NVHSinhVien");
      messenger.setAttribute(
        "agent-id",
        "922d25ed-e02f-4082-87ad-0abdc7658170"
      );
      messenger.setAttribute("language-code", "vi");
      containerRef.current.appendChild(messenger);
    }

    return () => {
      // Cleanup: remove script and messenger element
      const existingScript = document.querySelector(
        'script[src*="dialogflow-console"]'
      );
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} />;
}

