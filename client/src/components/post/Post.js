import "./Post.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Post() {
  let navigate = useNavigate();
  const { state } = useLocation();
  const paid = localStorage.getItem("paid") || false;

  useEffect(() => {
    if (state.post.paywall === true && paid === false) {
      const paywallPost = state.post;
      navigate("/paywall", {
        state: {
          paywallPost,
        },
      });
    }
  }, [state.post, navigate, paid]);

  return (
    <div className="postPage">
      <div className="postContainer">
        <div className="postTitle">
          <h1> {state.post.title}</h1>
        </div>
        <div className="postText"> {state.post.postText} </div>
      </div>
    </div>
  );
}

export default Post;
