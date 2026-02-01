package com.rec.lostlink.repository;

import com.rec.lostlink.entity.Item;
import com.rec.lostlink.entity.ItemStatus;
import com.rec.lostlink.entity.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByType(ItemType type);
    List<Item> findByTypeAndStatus(ItemType type, ItemStatus status);
    List<Item> findByUserId(Long userId);
}
