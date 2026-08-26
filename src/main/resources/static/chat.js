const token = localStorage.getItem("token");

const chatList = document.getElementById("chat-list")
const messageList = document.getElementById("message-list")
// DELETE LATER
const chatArea = document.getElementById("chatArea");

let activeChat = null;
let activeChatUserId = null;
let temporaryUser = null;

const messageInput = document.getElementById("messageInput");
const submitBtn = document.getElementById("submitBtn");
// submitBtn.addEventListener("click", () => sendMessage());
// messageInput.addEventListener("keydown", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         sendMessage();
//     }
// });

submitBtn.addEventListener("click", handleSend);

messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

const searchInput = document.getElementById("searchInput");

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
    // DELETE LATER
    chatArea.classList.add("hidden");

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
        if(temporaryUser){
            for (let i = 0; i < chats.length; i++) {
                const chat = chats[i];
                if(chat.username === temporaryUser.username){
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
    temporaryUser = null;
    //renderNavbar(chat)
    renderChatArea(chat.username, false);
    //loadmessages(chat.chatId)
}

// function renderNavbar(chat){
//     navbar.querySelector(".avatar-username").textContent =  chat.username.slice(0, 2).toUpperCase();
//     navbar.querySelector(".chat-name").textContent = chat.username;
//
//
// }

function renderChatArea(username, isTemporary){
    navbar.querySelector(".avatar-username").textContent =  username.slice(0, 2).toUpperCase();
    navbar.querySelector(".chat-name").textContent = username;
    chatArea.classList.remove("hidden");
    if (!isTemporary){
        // submitBtn.addEventListener("click", () => sendMessage());
        // messageInput.addEventListener("keydown", (e) => {
        //     if (e.key === "Enter" && !e.shiftKey) {
        //         e.preventDefault();
        //         sendMessage();
        //     }
        // });
        loadmessages(activeChat.chatId)

    }else{
        // submitBtn.addEventListener("click", () => sendFirstMessage());
        // messageInput.addEventListener("keydown", (e) => {
        //     if (e.key === "Enter" && !e.shiftKey) {
        //         e.preventDefault();
        //         sendMessage();
        //     }
        // });
        loadmessages();
    }
}

async function loadmessages(chatId){
    if (chatId == null) {
        messageList.replaceChildren();
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
        response = await fetch(`/api/messages/chat/${activeChat.chatId}`, {
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

loadChats();