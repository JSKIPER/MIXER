package com.exlay.mixer.service;

import com.exlay.mixer.dto.MessageRequest;
import com.exlay.mixer.dto.MessageResponse;
import com.exlay.mixer.dto.StartDirectMessageRequest;
import com.exlay.mixer.model.Chat;
import com.exlay.mixer.model.ChatParticipant;
import com.exlay.mixer.model.Message;
import com.exlay.mixer.model.User;
import com.exlay.mixer.repository.ChatParticipantRepository;
import com.exlay.mixer.repository.ChatRepository;
import com.exlay.mixer.repository.MessageRepository;
import com.exlay.mixer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<MessageResponse> getChatMessages(Long chatId, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        ensureUserIsParticipant(chatId, currentUser.getId());

        return messageRepository.findByChatIdOrderBySentAtAsc(chatId)
                .stream()
                .map(this::toMessageResponse)
                .toList();
    }

    @Transactional
    public MessageResponse startChat(
            StartDirectMessageRequest request,
            String currentUserEmail
    ) {
        validateContent(request.getContent());

        User sender = getUserByEmail(currentUserEmail);
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        if (sender.getId().equals(recipient.getId())) {
            throw new IllegalArgumentException("You cannot message yourself");
        }

        Chat chat = chatRepository.findDirectChatBetween(sender.getId(), recipient.getId())
                .orElseGet(() -> createDirectChat(sender, recipient));

        Message message = saveMessage(chat, sender, request.getContent());

        MessageResponse messageResponse = toMessageResponse(message);

        notifyRecipient(recipient, messageResponse);

        return messageResponse;
    }

    @Transactional
    public MessageResponse sendMessage(
            Long chatId,
            MessageRequest request,
            String currentUserEmail
    ) {
        validateContent(request.getContent());

        User sender = getUserByEmail(currentUserEmail);
        ensureUserIsParticipant(chatId, sender.getId());

        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        Message message = saveMessage(chat, sender, request.getContent());
        MessageResponse messageResponse = toMessageResponse(message);
        User recipient = getRecipient(chatId, sender.getId());
        notifyRecipient(recipient, messageResponse);
        return messageResponse;

    }

    private Chat createDirectChat(User firstUser, User secondUser) {
        Chat chat = chatRepository.save(Chat.builder().build());

        chatParticipantRepository.save(
                ChatParticipant.builder().chat(chat).user(firstUser).build()
        );
        chatParticipantRepository.save(
                ChatParticipant.builder().chat(chat).user(secondUser).build()
        );

        return chat;
    }

    private Message saveMessage(Chat chat, User sender, String content) {
        return messageRepository.save(
                Message.builder()
                        .chat(chat)
                        .sender(sender)
                        .content(content.trim())
                        .build()
        );
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void ensureUserIsParticipant(Long chatId, Long userId) {
        if (!chatParticipantRepository.existsByChatIdAndUserId(chatId, userId)) {
            throw new RuntimeException("You do not have access to this chat");
        }
    }

    private void validateContent(String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }
    }

    private MessageResponse toMessageResponse(Message message) {
        return new MessageResponse(
                message.getId(),
                message.getChat().getId(),
                message.getSender().getId(),
                message.getContent(),
                message.getStatus().name(),
                message.getSentAt()
        );
    }

    private User getRecipient(Long chatId, Long senderId) {
        List<ChatParticipant> participants =
                chatParticipantRepository.findByChatIdAndUserIdNot(chatId, senderId);

        if (participants.isEmpty()) {
            throw new RuntimeException("Recipient not found");
        }

        return participants.get(0).getUser();
    }

    private void notifyRecipient(User recipient, MessageResponse response) {
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/queue/messages",
                response
        );
    }

}
