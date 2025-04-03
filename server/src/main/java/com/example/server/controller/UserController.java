package com.example.server.controller;

import com.example.server.config.UserInfoUserDetails;
import com.example.server.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/{id}/reservations")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAllByUserId(@AuthenticationPrincipal UserInfoUserDetails userDetails, @PathVariable String id) {
        return ResponseEntity.ok(reservationService.findAllByUserId(userDetails.getUserInfo().getId()));
    }


}
