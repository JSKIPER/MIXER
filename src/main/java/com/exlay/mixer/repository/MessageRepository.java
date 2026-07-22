package com.exlay.mixer.repository;

import com.exlay.mixer.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByChatIdOrderBySentAtAsc(Long chatId);

    List<Message> findBySenderId(Long senderId);
}