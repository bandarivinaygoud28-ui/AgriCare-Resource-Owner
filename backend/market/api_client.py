import os
import requests
from typing import Dict, Any, Optional

OGD_BASE_URL = "https://api.data.gov.in/resource/"
DEFAULT_RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070"

class OGDMarketApiClient:
    def __init__(self):
        self.api_key = os.getenv("DATA_GOV_API_KEY", "").strip()
        self.resource_id = os.getenv("MARKET_PRICE_RESOURCE_ID", DEFAULT_RESOURCE_ID).strip()

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 5)

    def fetch_market_prices(
        self,
        commodity: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
        market: Optional[str] = None,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Fetches commodity price records from Government of India OGD API.
        Never returns or logs API key.
        """
        if not self.is_configured():
            return {
                "success": False,
                "error": "DATA_GOV_API_KEY not configured",
                "is_live": False,
                "records": []
            }

        url = f"{OGD_BASE_URL}{self.resource_id}"
        params = {
            "api-key": self.api_key,
            "format": "json",
            "offset": 0,
            "limit": limit
        }

        # Apply filters in OGD API format
        if commodity:
            params["filters[commodity]"] = commodity
        if state:
            params["filters[state]"] = state
        if district:
            params["filters[district]"] = district
        if market:
            params["filters[market]"] = market

        try:
            response = requests.get(url, params=params, timeout=8)
            if response.status_code == 200:
                data = response.json()
                records = data.get("records", [])
                return {
                    "success": True,
                    "is_live": True,
                    "total": data.get("total", len(records)),
                    "records": records,
                    "updated_date": data.get("updated_date")
                }
            elif response.status_code in (401, 403):
                return {
                    "success": False,
                    "error": "Invalid or expired Government OGD API key",
                    "is_live": False,
                    "records": []
                }
            else:
                return {
                    "success": False,
                    "error": f"OGD API returned status code {response.status_code}",
                    "is_live": False,
                    "records": []
                }
        except requests.Timeout:
            return {
                "success": False,
                "error": "OGD API request timed out",
                "is_live": False,
                "records": []
            }
        except Exception as e:
            return {
                "success": False,
                "error": "Unable to reach Government OGD API",
                "is_live": False,
                "records": []
            }

ogd_client = OGDMarketApiClient()
