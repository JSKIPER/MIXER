const token = localStorage.getItem("token");

const chatList = document.getElementById("chat-list")
const messageList = document.getElementById("message-list")
const chatArea = document.getElementById("chatArea");
const messageArea = document.querySelector(".message-area");
const navbarAvatar = document.getElementById("navbar-avatar");
const messageInput = document.getElementById("messageInput");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("searchInput");

let chatsList = null;
let activeChat = null;
let activeChatUserId = null;
let temporaryUser = null;
let stompClient = null;




submitBtn.addEventListener("click", handleSend);
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        findUser();
    }
});

if (!token) {
    window.location.href = "index.html";
}

async function loadChats() {

    try {
        const response = await fetch("/api/chats", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Could not load chats");
        }

        const chats = await response.json();
        chatsList = chats;

        console.log(chats);
        renderChats(chats);
        if(temporaryUser){
            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                if(chat.userId === temporaryUser.id){
                    openChat(chat)
                }
            }

        }

    } catch (error) {
        console.error(error);
    }
}

function renderChats(chats) {
    chatList.replaceChildren();

    chats.forEach(chat => {
        const chatItem = createChatItem(chat);
        chatList.appendChild(chatItem);
    });
}
function createChatItem(chat) {
    const chatItem = document.createElement("li");
    chatItem.classList.add("chat-item");
    chatItem.dataset.chatId = chat.chatId;

    const avatar = document.createElement("div");
    avatar.classList.add("avatar");
    avatar.classList.add(renderAvatar(chat.profilePhotoId));

    const avatarUsername = document.createElement("span");
    avatarUsername.classList.add("avatar-username");

    avatarUsername.textContent = chat.username.slice(0, 2).toUpperCase();

    const chatMeta = document.createElement("div");
    chatMeta.classList.add("chat-meta");

    const chatName = document.createElement("span");
    chatName.classList.add("chat-name");
    chatName.textContent = chat.username;

    avatar.appendChild(avatarUsername);
    chatMeta.appendChild(chatName);
    chatItem.append(avatar, chatMeta);

    chatItem.addEventListener("click", () => {
        openChat(chat);
    });

    return chatItem


}
function renderAvatar(profilePhotoId){
    if (profilePhotoId === "orange") {
        return "avatar--orange";
    }

    if (profilePhotoId === "blue") {
        return "avatar--blue";
    }

    if (profilePhotoId === "pink") {
        return "avatar--pink";
    }

    if (profilePhotoId === "green") {
        return "avatar--green";
    }

    if (profilePhotoId === "purple") {
        return "avatar--purple";
    }

    if (profilePhotoId === "yellow") {
        return "avatar--yellow";
    }
}
const navbar = document.getElementById("navbar")
function openChat(chat) {
    activeChat = chat;
    activeChatUserId = chat.userId;
    temporaryUser = null;
    //renderNavbar(chat)
    for (let i = 0; i < chatsList.length; i++) {
        if (chatsList[i].chatId === chat.chatId) {

            const chatItem = document.querySelectorAll('.chat-item')[i];
            const lastMessageSpan = chatItem.querySelector('.chat-last-message');

            if (lastMessageSpan) {
                lastMessageSpan.remove();
            }
        }
    }
    renderChatArea(chat.username, false, chat.profilePhotoId);


}


function renderChatArea(username, isTemporary, profilePhotoId){

    navbar.querySelector(".avatar-username").textContent =  username.slice(0, 2).toUpperCase();
    navbar.querySelector(".chat-name").textContent = username;
    navbarAvatar.className = "";
    navbarAvatar.classList.add("avatar");
    navbarAvatar.classList.add(renderAvatar(profilePhotoId));

    chatArea.classList.remove("hidden");
    if (!isTemporary){
        loadmessages(activeChat.chatId)

    }else{
        loadmessages();
    }
}

async function loadmessages(chatId){
    if (chatId == null) {
        messageList.replaceChildren();
        return;
    }
    try{
        const response = await fetch(`/api/messages/chat/${chatId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load messages");
        }

        const messages = await response.json();

        console.log(messages);
        renderMessages(messages);

    }catch (error){
        console.error("Error loading messages:", error);
    }

}

function renderMessages(messages){
    messageList.replaceChildren();
    messages.forEach(message => {
        const messageItem = createMessageItem(message);
        messageList.appendChild(messageItem);
    });
    messageArea.scrollTop = messageArea.scrollHeight;

}

function createMessageItem(message){
    const messageItem = document.createElement("li");
    const bubble = document.createElement("div");
    const time = document.createElement("div");
    time.classList.add("time");
    const formatted =
        message.sentAt.slice(8, 10) + "." +
        message.sentAt.slice(5, 7) + "." +
        message.sentAt.slice(0, 4) + ", " +
        message.sentAt.slice(11, 16);

    time.textContent = formatted;
    if(message.senderId === activeChatUserId){
        messageItem.classList.add("message-in");
        bubble.classList.add("buble-in");
        bubble.textContent = message.content;
    }else{
        messageItem.classList.add("message-out");
        bubble.classList.add("buble-out");
        bubble.textContent = message.content;
    }
    bubble.appendChild(time);
    messageItem.appendChild(bubble);

    return messageItem;


}
async function handleSend() {
    if (temporaryUser) {
        await sendFirstMessage();
        return;
    }

    if (activeChat) {
        await sendMessage();
    }
}
async function sendMessage(){
    const content = messageInput.value.trim();
    if (!content) return;
    if (!activeChat) return;

    try{
        const response = await fetch(`/api/messages/chat/${activeChat.chatId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error("Failed to send message");
        }
        const message = await response.json();
        const messageItem = createMessageItem(message);
        messageList.appendChild(messageItem);
        messageArea.scrollTop = messageArea.scrollHeight;
        messageInput.value = "";




    }catch(error){
        console.error("Error sending message:", error);
    }
}

async function sendFirstMessage(){
    const content = messageInput.value.trim();
    if (!content) return;
    if (!temporaryUser) return;

    try{
        const response = await fetch("/api/messages/startchat", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                recipientId: temporaryUser.id,
                content: content
            })
        });
        if (!response.ok) {
            throw new Error("Failed to start chat");
        }

        const message = await response.json();

        console.log(message);
        messageInput.value = "";

        loadChats();


    }catch (error){
        console.error("Error sending message:", error);
    }

}

async function findUser(){
    const tag = searchInput.value.trim();
    try{
        const response = await fetch(`/api/users/search?tag=${encodeURIComponent(tag)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to find user: ${response.status}`);
        }

        const user = await response.json();

        console.log(user);
        temporaryUser = user;
        activeChat =null;
        renderChatArea(user.username, true);



    }catch (error){
        console.error("Error sending message:", error);
    }

}
function connectWebSocket() {
    stompClient = new StompJs.Client({
        webSocketFactory: () => new SockJS(`${window.location.origin}/ws`),

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        debug: () => {
        }
    });

    stompClient.onConnect = () => {
        console.log("WebSocket connected");

        stompClient.subscribe("/user/queue/messages", (frame) => {
            const message = JSON.parse(frame.body);

            receiveMessage(message);
        });
    };

    stompClient.onStompError = (frame) => {
        console.error("WebSocket error:", frame.headers["message"]);
    };

    stompClient.onWebSocketError = (error) => {
        console.error("WebSocket connection error:", error);
    };

    stompClient.activate();
}

function receiveMessage(message) {
    console.log("Received real-time message:", message);
    if (activeChat && message.chatId === activeChat.chatId) {
        const messageItem = createMessageItem(message);
        messageList.appendChild(messageItem);

        messageArea.scrollTop = messageArea.scrollHeight;
        return;
    }else{
        for(let i=0;i<chatsList.length;i++){
            if(chatsList[i].chatId === message.chatId){
                const chatItem = document.querySelectorAll('.chat-item')[i];
                const newMessageSpan = document.createElement("span");
                const lastMessageSpan = chatItem.querySelector('.chat-last-message');
                if(!lastMessageSpan){
                    newMessageSpan.classList.add("chat-last-message");
                    newMessageSpan.textContent = "New Message";
                    const chatMetaDiv = chatItem.querySelector('.chat-meta');
                    chatMetaDiv.appendChild(newMessageSpan);
                }


            }
        }

    }



}
connectWebSocket();
loadChats();