package com.exlay.mixer.repository;

import com.exlay.mixer.model.ChatParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {

    List<ChatParticipant> findByChatId(Long chatId);

    List<ChatParticipant> findByUserId(Long userId);

    boolean existsByChatIdAndUserId(Long chatId, Long userId);

    List<ChatParticipant> findByChatIdAndUserIdNot(Long chatId, Long userId);
}