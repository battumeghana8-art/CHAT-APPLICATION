const socket = io();

let username = "";

const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");

const usernameInput = document.getElementById("username");
const messageInput = document.getElementById("messageInput");

const chatBox = document.getElementById("chatBox");
const onlineUsers = document.getElementById("onlineUsers");

/* JOIN CHAT */

function joinChat() {

    username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter a username");
        return;
    }

    socket.emit("join", username);

    usernameInput.disabled = true;
    joinBtn.disabled = true;

    messageInput.focus();
}

joinBtn.addEventListener("click", joinChat);

usernameInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        joinChat();

    }

});

/* SEND MESSAGE */

function sendMessage() {

    if (!username) {
        alert("Join the chat first");
        return;
    }

    const msg = messageInput.value.trim();

    if (msg === "") return;

    socket.emit("chatMessage", {
        username: username,
        message: msg
    });

    messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

messageInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

/* RECEIVE CHAT MESSAGES */

socket.on("chatMessage", (data) => {

    const div = document.createElement("div");

    div.className =
        data.username === username
        ? "message self"
        : "message";

    div.innerHTML = `
        <strong>${data.username}</strong>
        <p>${data.message}</p>
        <span>${data.time}</span>
    `;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
});

/* SYSTEM MESSAGES */

socket.on("systemMessage", (data) => {

    const div = document.createElement("div");

    div.className = "system";

    div.innerHTML = data.text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
});

/* ONLINE USERS */

socket.on("onlineUsers", (count) => {

    onlineUsers.innerHTML = `👥 Online: ${count}`;

});