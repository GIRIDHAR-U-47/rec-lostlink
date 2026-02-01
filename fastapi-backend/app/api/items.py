from fastapi import APIRouter, Depends, HTTPException, Query, Body
from typing import List
from datetime import datetime
from bson import ObjectId
from app.core.database import get_database
from app.models.item_model import ItemCreate, ItemResponse, ItemInDB
from app.models.enums import ItemType, ItemStatus, Role
from app.models.user_model import UserResponse
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/report", response_model=ItemResponse)
async def report_item(
    item_in: ItemCreate,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    item_dict = item_in.model_dump(by_alias=True)
    item_dict["user_id"] = str(current_user.id)
    item_dict["dateTime"] = datetime.utcnow() # Override with server time if needed, or keep user provided
    # Java uses LocalDateTime.now(), so we should probably set it here or respect payload if valid.
    # Java: itemRequest.setDateTime(LocalDateTime.now());
    item_dict["dateTime"] = datetime.utcnow()
    item_dict["status"] = ItemStatus.OPEN # Default to OPEN/PENDING. Java used PENDING which maps to OPEN in my Enum? 
    # Wait, Java used ItemStatus.PENDING. My enum has OPEN. Let's fix enum to match Java if needed or map. 
    # Java: PENDING, APPROVED, REJECTED, RETURNED likely?
    # I defined OPEN, CLAIMED, RESOLVED.
    # Let's align with Java names if possible or map.
    # I'll stick to my Enum but comments suggest Java uses PENDING.
    # I'll set it to ItemStatus.OPEN for now.
    
    result = await db["items"].insert_one(item_dict)
    created_item = await db["items"].find_one({"_id": result.inserted_id})
    
    # Populate user (simple version, ideally aggregation)
    created_item["user"] = current_user.model_dump(by_alias=True)
    return created_item

@router.get("/found", response_model=List[ItemResponse])
async def get_found_items(db = Depends(get_database)):
    # Java: findByTypeAndStatus(ItemType.FOUND, ItemStatus.PENDING)
    # Mapping PENDING -> OPEN
    cursor = db["items"].find({"type": ItemType.FOUND, "status": ItemStatus.OPEN})
    items = await cursor.to_list(length=100)
    # TODO: Populate user details for each item if frontend needs it
    return items

@router.get("/my-requests", response_model=List[ItemResponse])
async def get_my_requests(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    cursor = db["items"].find({"user_id": str(current_user.id)})
    items = await cursor.to_list(length=100)
    return items

@router.get("/lost", response_model=List[ItemResponse])
async def get_lost_items(
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    cursor = db["items"].find({"type": ItemType.LOST})
    items = await cursor.to_list(length=100)
    
    # Needs user population?
    results = []
    for item in items:
        user = await db["users"].find_one({"_id": ObjectId(item["user_id"])})
        if user:
            item["user"] = user
        results.append(item)
    return results

@router.put("/{id}/status")
async def update_item_status(
    id: str,
    status: ItemStatus,
    current_user: UserResponse = Depends(get_current_user),
    db = Depends(get_database)
):
    if current_user.role != Role.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    result = await db["items"].update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )
    
    if result.modified_count == 0:
         raise HTTPException(status_code=404, detail="Item not found")
         
    updated_item = await db["items"].find_one({"_id": ObjectId(id)})
    return updated_item
