import "./CreatePost.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [paywall, setPaywall] = useState(false) 

  let navigate = useNavigate();

  const addPost = async () => {
    const post = { title, postText, paywall };
    await fetch("http://localhost:3333/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(post),
    });
    navigate("/");
  };

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div className="inputGp">
          <label> Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div className='inputGp'>
            <label>Premium content?</label>
            <input 
            type='checkbox'
            checked={paywall}
            value={paywall}
            onChange={(e) => setPaywall(e.currentTarget.checked)} />
        </div>
        <button onClick={addPost}> Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
