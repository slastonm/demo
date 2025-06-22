import React, { useState, useEffect, useRef } from "react";
import "./Forum.css";

const Forum = () => {
  const postInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [analysis, setAnalysis] = useState([]);
  const loadGeneratedPosts = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/forum/slice-generated?offset=${offset}&limit=${limit}`
      );
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setOffset((prev) => prev + limit);
    } catch (err) {
      console.log("Error loading generated posts:", err);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.of) throw new Error("Failed token");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log(`Error loading posts ${err}`);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmit = async () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const content = postInputRef.current.value;
    const file = mediaInputRef.current?.value || "";

    if (!content || !file) return;
    if (editId !== null) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/forum/edit/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
          }
        );
        const updated = await res.json();

        setPosts((prev) => prev.map((p) => (p.id === editId ? updated : p)));
        setEditId(null);
        setEditContent("");
      } catch (err) {
        console.log("Edit error", err);
      }
    } else {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, file }),
        });
        const newPost = await res.json();
        setPosts((prev) => [newPost, ...prev]);
      } catch (err) {
        console.log(`Post creation error, ${err}`);
      }

      postInputRef.current.value = "";
      mediaInputRef.current.value = null;
      setPreview(null);
    }
  };

  const deletePost = async (id) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/forum/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const deleted = await res.json();
      setPosts((prev) => prev.filter((p) => p.id !== deleted.id));
    } catch (err) {
      console.log(`Delete error ${err}`);
    }
  };

  const handlKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };
  const handlMediaChange = () => {
    const file = mediaInputRef.current.files[0];

    if (!file) {
      setPreview(null);
      return;
    }
    const fileType = file.type;
    const url = URL.createObjectURL(file);

    let media;
    if (fileType.startsWith("image/")) {
      media = <img src={url} alt="perview" />;
    } else if (fileType.startsWith("video/")) {
      media = <video src={url} controls />;
    } else if (fileType.startsWith("audio/")) {
      media = <audio src={url} controls />;
    }
    setPreview(media);
  };

  const handleEdit = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      postInputRef.current.value = post.content;
      setEditContent(post.content);
      setEditId(postId);
    }
  };

  const handleDelete = async (postId) => {
    await deletePost(postId);
  };

  const analyzePosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/forum/analyze`);
      const data = await res.json();
      setAnalysis(data.analysis || []);
    } catch (err) {
      console.error("Analyze error:", err);
    }
  };

  return (
    <div>
      <section className="post-writing">
        <label>
          {editId ? "Edit your post:" : "Enter your post or select media:"}
        </label>
        <br />
        <textarea
          id="postInput"
          ref={postInputRef}
          defaultValue={editContent}
          onKeyDown={handlKeyPress}
          rows="4"
          cols="50"
          placeholder="Write something..."
        ></textarea>
        <br />
        <input
          ref={mediaInputRef}
          onChange={handlMediaChange}
          type="file"
          id="mediaInput"
        />
        <br />

        <button id="sendButton" onClick={handleSubmit}>
          {editId !== null ? "Update" : "Send"}
        </button>
        <div id="preview">{preview}</div>
        <br />
      </section>

      <div id="posts">
        {posts.map((post) => (
          <div className="post-container" key={post.id}>
            {post.content && <p>{post.content}</p>}
            {post.file && <p>File: {post.file}</p>}
            {/* {renderMedia(post)} */}
            <div>
              <button onClick={() => handleEdit(post.id)}>Edit</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={loadGeneratedPosts}>Load more generated posts</button>
        <button onClick={analyzePosts}>Analyze posts</button>
      </div>
      <div>
        {analysis.length > 0 && (
          <div className="analysis-results" style={{ marginTop: "1rem" }}>
            <h3>Результат аналізу:</h3>
            <ul>
              {analysis.map((result, idx) => (
                <li key={idx}>
                  {result.id ? `ID: ${result.id},` : ""} слово:{" "}
                  <strong>{result.word}</strong> — кількість: {result.count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forum;
