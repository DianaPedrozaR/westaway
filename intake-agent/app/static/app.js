(() => {
  "use strict";

  const overlay = document.getElementById("chat-modal-overlay");
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-input");
  const inputRow = document.getElementById("chat-input-row");
  const sendBtn = document.getElementById("send-button");
  const micBtn = document.getElementById("mic-button");
  const closeBtn = document.getElementById("close-chat");
  const calendlyContainer = document.getElementById("calendly-container");

  const OPENING_LINE =
    "Hi! I'm here to get our team ready for your call. What's going on — " +
    "type below, or hold the mic to talk it through.";

  const state = {
    sessionId: null,
    done: false,
    opened: false,
  };

  function addBubble(role, text) {
    const bubble = document.createElement("div");
    bubble.className =
      "px-3 py-2 text-sm " +
      (role === "user" ? "chat-bubble-user" : "chat-bubble-assistant");
    bubble.textContent = text;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return bubble;
  }

  function setInputEnabled(enabled) {
    inputEl.disabled = !enabled;
    sendBtn.disabled = !enabled;
    micBtn.disabled = !enabled;
  }

  function openModal() {
    overlay.classList.remove("hidden");
    overlay.classList.add("flex");
    if (!state.opened) {
      state.opened = true;
      addBubble("assistant", OPENING_LINE);
    }
    inputEl.focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || state.done) return;

    addBubble("user", text);
    inputEl.value = "";
    setInputEnabled(false);

    const thinking = addBubble("assistant", "...");

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: state.sessionId, message: text }),
      });
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();

      thinking.textContent = data.reply;
      state.sessionId = data.session_id;

      if (data.done) {
        state.done = true;
        if (data.calendly_url) {
          showCalendly(data.calendly_url);
        }
      } else {
        setInputEnabled(true);
        inputEl.focus();
      }
    } catch (err) {
      thinking.textContent =
        "Sorry, something went wrong on our end — please try that again.";
      setInputEnabled(true);
    }
  }

  function showCalendly(url) {
    inputRow.classList.add("hidden");
    calendlyContainer.classList.remove("hidden");
    calendlyContainer.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "calendly-inline-widget";
    widget.setAttribute("data-url", url);
    widget.style.minWidth = "280px";
    widget.style.height = "100%";
    calendlyContainer.appendChild(widget);

    // Calendly's widget.js watches the DOM for new .calendly-inline-widget
    // nodes, but call the explicit init too in case it already ran once.
    if (window.Calendly && typeof window.Calendly.initInlineWidget === "function") {
      window.Calendly.initInlineWidget({ url, parentElement: widget });
    }
  }

  document.getElementById("open-chat-nav").addEventListener("click", openModal);
  document.getElementById("open-chat-hero").addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // --- Hold-to-speak dictation (Web Speech API) ---
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    // Not supported (e.g. Safari) — hide the button rather than offer a
    // control that silently does nothing.
    micBtn.classList.add("hidden");
  } else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let recognizing = false;
    let baseText = "";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      inputEl.value = (baseText + " " + transcript).trim();
    };

    recognition.onerror = () => stopRecording();
    recognition.onend = () => {
      recognizing = false;
      micBtn.classList.remove("mic-recording");
    };

    function startRecording(e) {
      e.preventDefault();
      if (recognizing || inputEl.disabled) return;
      recognizing = true;
      baseText = inputEl.value;
      micBtn.classList.add("mic-recording");
      try {
        recognition.start();
      } catch (_) {
        // start() throws if already started — safe to ignore
      }
    }

    function stopRecording() {
      if (!recognizing) return;
      recognizing = false;
      micBtn.classList.remove("mic-recording");
      recognition.stop();
    }

    micBtn.addEventListener("mousedown", startRecording);
    micBtn.addEventListener("touchstart", startRecording, { passive: false });
    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((evt) =>
      micBtn.addEventListener(evt, stopRecording)
    );
  }
})();
