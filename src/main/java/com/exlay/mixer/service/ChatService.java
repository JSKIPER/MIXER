package com.exlay.mixer.service;

import com.exlay.mixer.dto.ChatResponse;
import com.exlay.mixer.model.Chat;
import com.exlay.mixer.model.ChatParticipant;
import com.exlay.mixer.model.User;
import com.exlay.mixer.repository.ChatParticipantRepository;
import com.exlay.mixer.repository.ChatRepository;
import com.exlay.mixer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatParticipantRepository chatParticipantRepository;

    public List<ChatResponse> getUserChats(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Chat> chats = chatRepository.findChatsByUserId(currentUser.getId());
        List<ChatResponse> chatResponses = new ArrayList<>();
        for(int i=0;i<chats.size();i++){
            List<ChatParticipant> ChatParticipant = chatParticipantRepository.findByChatIdAndUserIdNot(chats.get(i).getId(), currentUser.getId());
            Long anotherUserId = ChatParticipant.get(0).getUser().getId();
            String anotherUsername = ChatParticipant.get(0).getUser().getUsername();

            chatResponses.add(
                    new ChatResponse(chats.get(i).getId(),anotherUserId,anotherUsername)
            );

        }
        return chatResponses;



    }

}
