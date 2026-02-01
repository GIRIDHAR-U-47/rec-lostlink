package com.rec.lostlink.controller;

import com.rec.lostlink.entity.*;
import com.rec.lostlink.repository.ClaimRepository;
import com.rec.lostlink.repository.ItemRepository;
import com.rec.lostlink.repository.UserRepository;
import com.rec.lostlink.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    ClaimRepository claimRepository;

    @Autowired
    ItemRepository itemRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitClaim(@RequestBody Claim claimRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User claimant = userRepository.findById(userDetails.getId()).orElse(null);

        // Fetch item to ensure it exists
        Item item = itemRepository.findById(claimRequest.getItem().getId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        claimRequest.setClaimant(claimant);
        claimRequest.setItem(item);
        claimRequest.setStatus(ClaimStatus.PENDING);
        claimRequest.setSubmissionDate(LocalDateTime.now());

        Claim savedClaim = claimRepository.save(claimRequest);
        return ResponseEntity.ok(savedClaim);
    }

    @GetMapping("/item/{itemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Claim> getClaimsForItem(@PathVariable Long itemId) {
        return claimRepository.findByItemId(itemId);
    }
    
    @GetMapping("/my-claims")
    public List<Claim> getMyClaims() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return claimRepository.findByClaimantId(userDetails.getId());
    }

    @GetMapping("/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Claim> getClaimsByStatus(@RequestParam ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }

    @PutMapping("/{id}/verify")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> verifyClaim(@PathVariable Long id, @RequestParam ClaimStatus status) {
        return claimRepository.findById(id).map(claim -> {
            claim.setStatus(status);
            claimRepository.save(claim);
            
            // If approved, update item status to RETURNED? Or keep item as APPROVED until handed over? 
            // Let's say if Claim is APPROVED, Item should be RETURNED or at least flagged.
            if (status == ClaimStatus.APPROVED) {
                Item item = claim.getItem();
                item.setStatus(ItemStatus.RETURNED);
                itemRepository.save(item);
            }
            
            return ResponseEntity.ok(claim);
        }).orElse(ResponseEntity.notFound().build());
    }
}
