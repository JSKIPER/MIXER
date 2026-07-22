package com.exlay.mixer.repository;

import com.exlay.mixer.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query("""
            SELECT DISTINCT cp.chat
            FROM ChatParticipant cp
            WHERE cp.user.id = :userId
            """)
    List<Chat> findChatsByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT c
            FROM Chat c
            WHERE (SELECT COUNT(cp) FROM ChatParticipant cp WHERE cp.chat = c) = 2
              AND EXISTS (
                  SELECT firstParticipant.id
                  FROM ChatParticipant firstParticipant
                  WHERE firstParticipant.chat = c
                    AND firstParticipant.user.id = :firstUserId
              )
              AND EXISTS (
                  SELECT secondParticipant.id
                  FROM ChatParticipant secondParticipant
                  WHERE secondParticipant.chat = c
                    AND secondParticipant.user.id = :secondUserId
              )
            """)
    Optional<Chat> findDirectChatBetween(
            @Param("firstUserId") Long firstUserId,
            @Param("secondUserId") Long secondUserId
    );
}
