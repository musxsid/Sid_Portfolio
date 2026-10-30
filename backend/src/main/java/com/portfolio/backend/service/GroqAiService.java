package com.portfolio.backend.service;

import com.portfolio.backend.dto.ChatRequestDto;
import com.portfolio.backend.dto.ChatResponseDto;

public interface GroqAiService {
    ChatResponseDto processChat(ChatRequestDto request);
}

