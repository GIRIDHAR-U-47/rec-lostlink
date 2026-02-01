package com.rec.lostlink.controller;

import com.rec.lostlink.entity.Item;
import com.rec.lostlink.entity.ItemStatus;
import com.rec.lostlink.entity.ItemType;
import com.rec.lostlink.entity.User;
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
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    ItemRepository itemRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/report")
    public ResponseEntity<?> reportItem(@RequestBody Item itemRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);

        itemRequest.setUser(user);
        itemRequest.setDateTime(LocalDateTime.now());
        itemRequest.setStatus(ItemStatus.PENDING);
        
        Item savedItem = itemRepository.save(itemRequest);
        return ResponseEntity.ok(savedItem);
    }

    @GetMapping("/found")
    public List<Item> getFoundItems() {
        return itemRepository.findByTypeAndStatus(ItemType.FOUND, ItemStatus.PENDING); // Show only pending found items publicly? Or approved? 
        // For now, let's show all PENDING found items (waiting for claim)
        // If Student Care confirms receipt, maybe status changes to APPROVED? 
        // Let's assume APPROVED means "Verified and ready to be claimed".
        // PENDING might mean "Reported by user, not yet physically verified".
    }

    // Get all items for the logged in user
    @GetMapping("/my-requests")
    public List<Item> getMyRequests() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return itemRepository.findByUserId(userDetails.getId());
    }

    // Admin: Get all lost items
    @GetMapping("/lost")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Item> getAllLostItems() {
        return itemRepository.findByType(ItemType.LOST);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateItemStatus(@PathVariable Long id, @RequestParam ItemStatus status) {
        return itemRepository.findById(id).map(item -> {
            item.setStatus(status);
            itemRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }
}
