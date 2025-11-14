"use client";

import { useEffect } from "react";

// Type declaration for df-messenger custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "df-messenger": {
        intent?: string;
        "chat-title"?: string;
        "agent-id"?: string;
        "language-code"?: string;
      };
    }
  }
}

export default function DialogflowMessenger() {
  useEffect(() => {
    // Load Dialogflow script
    const script = document.createElement("script");
    script.src =
      "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      const existingScript = document.querySelector(
        'script[src*="dialogflow-console"]'
      );
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <df-messenger
      intent="WELCOME"
      chat-title="NVHSinhVien"
      agent-id="922d25ed-e02f-4082-87ad-0abdc7658170"
      language-code="vi"
    />
  );
}

