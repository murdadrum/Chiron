import React from "react";
import { useLesson } from "../context/LessonContext";

// Small toggle component to include detailed instructions
const ToggleIncludeDetails = () => {
  const { includeDetails, setIncludeDetails } = useLesson();
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={!!includeDetails}
        onChange={(e) => setIncludeDetails(!!e.target.checked)}
        style={{ width: "18px", height: "18px", cursor: "pointer" }}
      />
      <span style={{ fontSize: "0.72rem", color: "#999", fontWeight: "600" }}>
        Detailed steps
      </span>
    </label>
  );
};

// Helper component moved outside to prevent re-mounting on every state update (fixes input freeze/focus loss)
const PromptField = ({
  isFull,
  autoFocus,
  inputValue,
  setInputValue,
  handleSubmit,
  loading,
}) => (
  <form
    onSubmit={handleSubmit}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      backgroundColor: "#050505",
      padding: isFull ? "16px 24px" : "10px 16px",
      borderRadius: isFull ? "16px" : "10px",
      border: "1px solid #222",
      boxShadow: isFull
        ? "0 10px 40px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.05)"
        : "inset 0 2px 4px rgba(0,0,0,0.5)",
      width: isFull ? "100%" : "auto",
      maxWidth: isFull ? "600px" : "none",
      flex: isFull ? "none" : 1,
      transition: "all 0.3s ease",
      margin: isFull ? "0 auto" : "0",
    }}
  >
    <span
      style={{
        color: "#00ff88",
        fontWeight: "bold",
        fontSize: isFull ? "1.4rem" : "1.1rem",
        fontFamily: "monospace",
        textShadow: "0 0 10px rgba(0, 255, 136, 0.5)",
      }}
    >
      &gt;
    </span>
    <input
      type="text"
      autoFocus={autoFocus}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={
        isFull ? "What would you like to build today?" : "Ask Chiron..."
      }
      style={{
        flex: 1,
        backgroundColor: "transparent",
        border: "none",
        color: "#fff",
        outline: "none",
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: isFull ? "1.1rem" : "0.9rem",
        letterSpacing: "0.5px",
      }}
    />
    <button
      type="submit"
      disabled={loading || !inputValue.trim()}
      style={{
        backgroundColor: isFull ? "#00ff88" : "#111",
        border: "1px solid #333",
        color: isFull
          ? "#000"
          : loading || !inputValue.trim()
          ? "#333"
          : "#00ff88",
        padding: isFull ? "8px 24px" : "4px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: isFull ? "0.85rem" : "0.7rem",
        fontWeight: "bold",
        transition: "all 0.2s",
        textTransform: "uppercase",
        boxShadow:
          isFull && !loading && inputValue.trim()
            ? "0 0 20px rgba(0, 255, 136, 0.4)"
            : "none",
      }}
    >
      {isFull ? "Initiate" : "Query"}
    </button>
  </form>
);

const InstructorConsole = () => {
  const {
    selectedChapter,
    lessonData,
    loading,
    error,
    currentStepIndex,
    nextStep,
    prevStep,
    requestCustomLesson,
    resetLesson,
  } = useLesson();
  const [inputValue, setInputValue] = React.useState("");
  const [isFinished, setIsFinished] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      setIsFinished(false);
    }
  }, [loading]);

  const handleFinished = () => {
    setIsFinished(true);
    resetLesson();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      requestCustomLesson(inputValue);
      setInputValue("");
    }
  };

  const currentStep = lessonData ? lessonData[currentStepIndex] : null;

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
        color: "#e0e0e0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        background: "linear-gradient(180deg, #111 0%, #0a0a0a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
          flexShrink: 0,
          borderBottom: "1px solid #222",
          paddingBottom: "12px",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: loading ? "#00d4ff" : "#00ff88",
              marginRight: "12px",
              boxShadow: loading ? "0 0 12px #00d4ff" : "0 0 12px #00ff88",
              animation: loading
                ? "pulse-blue 1.5s infinite ease-in-out"
                : "pulse-green 2s infinite ease-in-out",
            }}
          ></div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: "800",
              color: loading ? "#00d4ff" : "#00ff88",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {loading
              ? "Consulting Neural Manual..."
              : "Chiron Instructor Online"}
          </span>
        </div>
        {lessonData && (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Include detailed instructions toggle */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginRight: "8px",
              }}
            >
              {/* wire to lesson context */}
              <ToggleIncludeDetails />
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#666",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              {currentStepIndex + 1} / {lessonData.length}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0 || loading}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "1px solid #333",
                  backgroundColor: "transparent",
                  color: currentStepIndex === 0 ? "#333" : "#fff",
                  cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  transition: "all 0.2s",
                }}
              >
                ←
              </button>
              <button
                onClick={
                  currentStepIndex === lessonData.length - 1
                    ? handleFinished
                    : nextStep
                }
                disabled={loading}
                style={{
                  padding: "0 12px",
                  height: "24px",
                  borderRadius: "66px",
                  border: "none",
                  backgroundColor:
                    currentStepIndex === lessonData.length - 1
                      ? "#00ff88"
                      : "#333",
                  color:
                    currentStepIndex === lessonData.length - 1
                      ? "#000"
                      : "#fff",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  transition: "all 0.2s",
                  boxShadow:
                    currentStepIndex === lessonData.length - 1
                      ? "0 0 10px rgba(0, 255, 136, 0.4)"
                      : "none",
                }}
              >
                {currentStepIndex === lessonData.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area - STRICTLY NO SCROLL */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          marginBottom: currentStep ? "15px" : "0",
          minHeight: 0,
          paddingRight: "0",
          zIndex: 1,
        }}
      >
        {loading && (
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#666",
            }}
          >
            <div className="loader"></div>
            <p
              style={{
                marginTop: "15px",
                fontSize: "0.9rem",
                fontStyle: "italic",
              }}
            >
              Synthesizing lessons for "{selectedChapter}"...
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#ff4444",
              backgroundColor: "rgba(255, 68, 68, 0.1)",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 68, 68, 0.3)",
              margin: "10px 0",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
              Communication Error
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.8 }}>{error}</div>
          </div>
        )}

        {currentStep && !loading && (
          <div className="fade-in">
            <h3
              style={{
                margin: "0 0 8px 0",
                fontSize: "0.85rem",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {selectedChapter}
            </h3>
            <p
              style={{
                fontSize: "1.2rem",
                lineHeight: "1.6",
                marginBottom: "20px",
                color: "#fff",
                fontWeight: "500",
              }}
            >
              {currentStep.text}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "25px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: "#1a1a1a",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #333",
                }}
              >
                <span style={{ color: "#666", marginRight: "5px" }}>
                  TARGET:
                </span>
                <span style={{ color: "#00d4ff", fontWeight: "bold" }}>
                  {currentStep.ui_target}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  backgroundColor: "#1a1a1a",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "1px solid #333",
                }}
              >
                <span style={{ color: "#666", marginRight: "5px" }}>
                  EXECUTE:
                </span>
                <span style={{ fontWeight: "bold", color: "#fff" }}>
                  {currentStep.command}
                </span>
              </div>
            </div>

            {/* Navigation buttons moved to header */}
          </div>
        )}

        {!loading && !currentStep && !error && (
          <div
            className="fade-in"
            style={{
              minHeight: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <PromptField
              isFull={true}
              autoFocus={true}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              loading={loading}
            />

            {isFinished && (
              <button
                onClick={() => setIsFinished(false)}
                style={{
                  marginTop: "20px",
                  padding: "6px 16px",
                  backgroundColor: "transparent",
                  border: "1px solid #333",
                  color: "#888",
                  borderRadius: "66px",
                  cursor: "pointer",
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Reset Calibration
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Input Form (Only during lesson) */}
      {currentStep && !loading && (
        <div style={{ flexShrink: 0, paddingTop: "10px" }}>
          <PromptField
            isFull={false}
            autoFocus={false}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      )}

      <style>{`
                @keyframes pulse-green {
                    0% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.8; }
                }
                @keyframes pulse-blue {
                    0% { transform: scale(1); box-shadow: 0 0 5px #00d4ff; }
                    50% { transform: scale(1.2); box-shadow: 0 0 20px #00d4ff; }
                    100% { transform: scale(1); box-shadow: 0 0 5px #00d4ff; }
                }
                .fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .loader {
                    border: 2px solid #222;
                    border-top: 2px solid #00d4ff;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
    </div>
  );
};

export default InstructorConsole;
