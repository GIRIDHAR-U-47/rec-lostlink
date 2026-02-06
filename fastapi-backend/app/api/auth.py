from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.core.database import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user_model import UserCreate, UserResponse, UserInDB
from app.models.enums import Role
from datetime import timedelta

router = APIRouter()

@router.post("/login")
async def login(
    login_request: dict = Body(...), # Accepting arbitrary dict to match frontend
    db = Depends(get_database)
) -> Any:
    # Frontend sends { "email": "...", "password": "..." }
    email = login_request.get("email")
    password = login_request.get("password")

    if not email or not password:
         raise HTTPException(status_code=400, detail="Email and password required")

    user = await db["users"].find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(password, user["password"]): # stored as 'password' in existing Java entity but likely hashed
        # Wait, Java code uses encoder.encode(signUpRequest.getPassword()).
        # If we are connecting to the same DB, we need to verify the hash.
        # Java likely uses BCrypt. Python passlib[bcrypt] should be compatible.
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Generate JWT
    # Java stores roles as a list in JWT response
    roles = [user["role"]]

    access_token = create_access_token(
        data={"sub": user["email"], "roles": roles}
    )

    print(f"Login request for: {email}") # DEBUG LOG
    
    response_data = {
        "token": access_token,
        "accessToken": access_token, # details for compatibility
        "type": "Bearer",
        "id": str(user["_id"]),
        "email": user["email"],
        "roles": roles,
        "name": user.get("name"),
        "registerNumber": user.get("register_number") or user.get("registerNumber")
    }
    print("Returning response:", response_data) # DEBUG LOG
    return response_data

@router.post("/register")
async def register(
    user_in: UserCreate,
    db = Depends(get_database)
) -> Any:
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user_in.email})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Error: Email is already in use!"
        )
    
    hashed_password = get_password_hash(user_in.password)
    
    user_dict = user_in.model_dump()
    user_dict["password"] = hashed_password
    
    # Insert
    result = await db["users"].insert_one(user_dict)
    
    return {"message": "User registered successfully!"}
