import { auth, db, firebase } from "./firebase-config.js";

const loginGoogleBtn = document.getElementById("login-google");
const loginAnonBtn = document.getElementById("login-anon");
const logoutBtn = document.getElementById("logout");
const userInfo = document.getElementById("user-info");
const commentForm = document.getElementById("comment-form");
const commentList = document.getElementById("comment-list");
const usernameInput = document.getElementById("username");
const commentInput = document.getElementById("comment");
const parentIdInput = document.getElementById("parentId");

let currentUser = null;

loginGoogleBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(e => alert("Lỗi đăng nhập Google: " + e.message));
};

loginAnonBtn.onclick = () => {
  auth.signInAnonymously().catch(e => alert("Lỗi đăng nhập ẩn danh: " + e.message));
};

logoutBtn.onclick = () => {
  auth.signOut();
};

auth.onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    const name = user.isAnonymous ? "Ẩn danh" : user.displayName || user.email;
    userInfo.textContent = `Đã đăng nhập: ${name}`;
    commentForm.style.display = "block";
  } else {
    userInfo.textContent = "Chưa đăng nhập";
    commentForm.style.display = "none";
  }
});

// Thêm comment
commentForm.onsubmit = async (e) => {
  e.preventDefault();
  if (!currentUser) return alert("Bạn phải đăng nhập để bình luận.");

  const username = usernameInput.value.trim() || (currentUser.isAnonymous ? "Ẩn danh" : currentUser.displayName || "Người dùng");
  const text = commentInput.value.trim();
  const parentId = parentIdInput.value || null;

  if (!text) return alert("Comment không được để trống.");

  await db.collection("comments").add({
    username,
    text,
    parentId,
    uid: currentUser.uid,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });

  commentForm.reset();
  parentIdInput.value = "";
};

// Load và hiển thị comment
function renderComments(comments) {
  commentList.innerHTML = "";

  // Tạo cây comment (nested) từ flat array
  const map = {};
  comments.forEach(c => {
    c.children = [];
    map[c.id] = c;
  });

  const roots = [];
  comments.forEach(c => {
    if (c.parentId) {
      if (map[c.parentId]) {
        map[c.parentId].children.push(c);
      }
    } else {
      roots.push(c);
    }
  });

  function createCommentElement(c, level = 0) {
    const div = document.createElement("div");
    div.className = "p-3 border border-gray-700 rounded bg-gray-800";
    div.style.marginLeft = (level * 20) + "px";

    div.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <strong>${escapeHTML(c.username)}</strong>
        <small class="text-gray-400 text-xs">${c.timestamp ? new Date(c.timestamp.seconds * 1000).toLocaleString() : "..."}</small>
      </div>
      <p class="mb-1">${escapeHTML(c.text)}</p>
      <button class="reply-btn text-pink-400 text-sm hover:underline">Trả lời</button>
    `;

    const replyBtn = div.querySelector(".reply-btn");
    replyBtn.onclick = () => {
      parentIdInput.value = c.id;
      usernameInput.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // render con
    c.children.forEach(child => {
      div.appendChild(createCommentElement(child, level + 1));
    });

    return div;
  }

  roots.forEach(root => {
    commentList.appendChild(createCommentElement(root));
  });
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

db.collection("comments")
  .orderBy("timestamp", "desc")
  .onSnapshot(snapshot => {
    const comments = [];
    snapshot.forEach(doc => comments.push({ id: doc.id, ...doc.data() }));
    renderComments(comments);
  });
