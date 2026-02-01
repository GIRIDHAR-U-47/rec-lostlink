package com.rec.lostlink.payload.request;

import com.rec.lostlink.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    @NotBlank
    private String name;

    private String registerNumber;

    private Role role; // Optional, default to USER if null
}
