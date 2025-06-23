import React, { useState } from "react";

const FileInfo = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchFileInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/analyze/analyze-file`);
      const data = await res.json();
      console.log(data);
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
                <strong>Total lines:</strong> {info.lineCount}
              </p>
              <p>
                <strong>Total words:</strong> {info.wordCount}
              </p>
              <p>
                <strong>Total char:</strong> {info.charCount}
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default FileInfo;
