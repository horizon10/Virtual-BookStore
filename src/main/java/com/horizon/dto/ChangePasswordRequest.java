package com.horizon.dto;

public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;

    // Getter ve Setter metodları

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        if (currentPassword == null || currentPassword.isEmpty()) {
            throw new IllegalArgumentException("Mevcut şifre boş olamaz.");
        }
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("Yeni şifre boş olamaz.");
        }
        this.newPassword = newPassword;
    }
}
