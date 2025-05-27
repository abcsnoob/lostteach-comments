import firebaseConfig from "./firebase-config.js";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const commentForm = document.getElementById("comment-form");
const usernameInput = document.getElementById("username");
const commentInput = document.getElementById("comment");
const commentList = document.getElementById("comment-list");

let replyingTo = null; // id comment đang reply

commentForm.addEventListener("submit", e => {
  e.preventDefault();

  const username = usernameInput.value.trim() || "Ẩn danh";
  const commentText = commentInput.value.trim();
  if (!commentText) {
    alert("Nhập nội dung đi bạn ơi!");
    return;
  }

  const newComment = {
    username,
    comment: commentText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    parentId: replyingTo
  };

  db.collection("bad-comments").add(newComment)
    .then(() => {
      commentInput.value = "";
      replyingTo = null;
      commentInput.placeholder = "Nhập comment mặn như nước biển...";
      loadComments();
    });
});

function createCommentElement(doc) {
  const data = doc.data();

  const div = document.createElement("div");
  div.classList.add("border", "border-pink-600", "rounded", "p-3");
  div.style.marginLeft = data.parentId ? "30px" : "0";

  const header = document.createElement("div");
  header.classList.add("flex", "justify-between", "items-center", "mb-1");

  const userSpan = document.createElement("b");
  userSpan.textContent = data.username;

  const timeSpan = document.createElement("small");
  if (data.timestamp) {
    timeSpan.textContent = new Date(data.timestamp.seconds * 1000).toLocaleString();
  } else {
    timeSpan.textContent = "vừa gửi";
  }

  const replyBtn = document.createElement("button");
  replyBtn.textContent = "Reply";
  replyBtn.classList.add("text-sm", "text-pink-400", "hover:underline");
  replyBtn.onclick = () => {
    replyingTo = doc.id;
    commentInput.focus();
    commentInput.placeholder = `Reply bình luận của ${data.username}...`;
  };

  header.appendChild(userSpan);
  header.appendChild(timeSpan);
  header.appendChild(replyBtn);

  const contentP = document.createElement("p");
  contentP.textContent = data.comment;
  contentP.classList.add("whitespace-pre-wrap");

  div.appendChild(header);
  div.appendChild(contentP);

  return div;
}

function loadComments() {
  commentList.innerHTML = "";
  db.collection("bad-comments")
    .orderBy("timestamp", "asc")
    .get()
    .then(snapshot => {
      const allComments = {};
      snapshot.forEach(doc => {
        allComments[doc.id] = {...doc.data(), id: doc.id};
      });

      function appendComments(parentId = null, container) {
        for (const id in allComments) {
          if ((allComments[id].parentId || null) === parentId) {
            const elem = createCommentElement({
              id,
              data: () => allComments[id]
            });
            container.appendChild(elem);
            appendComments(id, container);
          }
        }
      }

      appendComments(null, commentList);
    });
}

loadComments();
