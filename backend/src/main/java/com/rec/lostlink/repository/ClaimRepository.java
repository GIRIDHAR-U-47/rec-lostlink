package com.rec.lostlink.repository;

import com.rec.lostlink.entity.Claim;
import com.rec.lostlink.entity.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByClaimantId(Long claimantId);
    List<Claim> findByItemId(Long itemId);
    List<Claim> findByStatus(ClaimStatus status);
}
