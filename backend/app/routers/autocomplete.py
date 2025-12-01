from fastapi import APIRouter
from ..schemas import AutocompleteRequest, AutocompleteResponse
from ..services.autocomplete_service import AutocompleteService

router = APIRouter(tags=["autocomplete"])

@router.post("/autocomplete", response_model=AutocompleteResponse)
def get_autocomplete(request: AutocompleteRequest):
    """Get AI autocomplete suggestions"""
    suggestions = AutocompleteService.get_suggestions(
        request.code,
        request.cursorPosition,
        request.language
    )
    
    return AutocompleteResponse(suggestions=suggestions)