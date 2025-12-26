package com.education.sms.service;

import com.education.sms.dto.RegisterRequest;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {
    // abstract method to register and login
    String register(RegisterRequest registerRequest);
    String login(String email, String password);
}
