const token = localStorage.getItem("token");

const chatList = document.getElementById("chat-list")
const messageList = document.getElementById("message-list")
let activeChat = null;
let activeChatUserId = null;

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

        console.log(chats);
        renderChats(chats);

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
const navbar = document.getElementById("navbar")
function openChat(chat) {
    activeChat = chat;
    activeChatUserId = chat.userId;
    renderNavbar(chat)
    loadmessages(chat.chatId)
}

function renderNavbar(chat){
    navbar.querySelector(".avatar-username").textContent =  chat.username.slice(0, 2).toUpperCase();
    navbar.querySelector(".chat-name").textContent = chat.username;


}

async function loadmessages(chatId){
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

}

function createMessageItem(message){
    const messageItem = document.createElement("li");
    const bubble = document.createElement("div");
    if(message.senderId === activeChatUserId){
        messageItem.classList.add("message-in");
        bubble.classList.add("buble-in");
        bubble.textContent = message.content;
    }else{
        messageItem.classList.add("message-out");
        bubble.classList.add("buble-out");
        bubble.textContent = message.content;
    }
    messageItem.appendChild(bubble);
    return messageItem;


}

loadChats();