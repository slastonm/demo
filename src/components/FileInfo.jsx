import React, { useState } from "react";

const FileInfo = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFileInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/analyze/analyze-file");
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      console.error("Failed to load file info:", err);
      setInfo({ error: "Failed to load file info" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{ padding: "1rem", border: "1px solid #ccc", marginTop: "1rem" }}
    >
      <h2>File Analyzer</h2>
      <button onClick={fetchFileInfo} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze File"}
      </button>

      {info && (
        <div style={{ marginTop: "1rem" }}>
          {info.error ? (
            <p style={{ color: "red" }}>{info.error}</p>
          ) : (
            <>
              <p>
                <strong>Total lines:</strong> {info.lines}
              </p>
              <p>
                <strong>Total words:</strong> {info.totalWords}
              </p>
              <h4>Preview (first 10 lines):</h4>
              <ul>
                {info.results.map((line) => (
                  <li key={line.line}>
                    Line {line.line}: {line.words} words
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default FileInfo;
