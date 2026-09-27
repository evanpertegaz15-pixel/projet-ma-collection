from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

async def http_error_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "erreur": {
                "code": exc.status_code,
                "message": exc.detail
            }
        }
    )