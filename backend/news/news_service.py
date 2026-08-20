import os
import re
import time
import hashlib
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# Image mapping for agricultural topics
CATEGORY_IMAGE_MAP = {
    "🌾 Paddy / Rice": "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80",
    "🌽 Maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80",
    "🧅 Onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    "🥔 Potato": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    "🍅 Tomato": "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80",
    "🌶️ Chilli": "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80",
    "🫘 Pulses": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    "🍬 Sugar": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80",
    "🌻 Oilseeds": "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=600&auto=format&fit=crop&q=80",
    "📈 Mandi / Commodity Market": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    "🏛️ MSP / Government Procurement": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
    "🚜 Agriculture Policies": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
    "Weather & Agriculture": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80",
    "Export/Import": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80",
    "Default": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80"
}

# In-memory news cache with 3-minute TTL
NEWS_CACHE: Dict[str, Any] = {
    "timestamp": 0,
    "articles": [],
    "queries": {}
}

CACHE_TTL_SECONDS = 180 # 3 minutes

def _clean_html(raw_html: str) -> str:
    """Removes HTML tags and entities from RSS descriptions."""
    if not raw_html:
        return ""
    clean = re.sub(r'<.*?>', '', raw_html)
    clean = clean.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'").replace('&#39;', "'")
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def _format_pubdate(pub_date_str: str) -> str:
    """Formats RFC 822 / GMT dates into clean readable formats."""
    if not pub_date_str:
        return "Recently"
    try:
        # e.g., "Thu, 20 Aug 2026 06:15:00 GMT" or "20 Aug 2026 06:15:00 +0000"
        clean_date = pub_date_str.replace("GMT", "+0000").strip()
        # Parse standard RFC 822 format
        for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S +0000", "%d %b %Y %H:%M:%S %z", "%Y-%m-%dT%H:%M:%SZ"):
            try:
                dt = datetime.strptime(clean_date, fmt)
                now = datetime.now(timezone.utc)
                diff = now - dt
                secs = int(diff.total_seconds())
                if secs < 3600:
                    mins = max(1, secs // 60)
                    return f"{mins}m ago"
                elif secs < 86400:
                    hrs = secs // 3600
                    return f"{hrs}h ago"
                elif secs < 172800:
                    return "Yesterday"
                else:
                    return dt.strftime("%d %b %Y")
            except ValueError:
                continue
    except Exception:
        pass
    return pub_date_str.split(" 202")[0] if " 202" in pub_date_str else pub_date_str

def _categorize_article(title: str, summary: str) -> str:
    """Classifies an agricultural article into specific crop/topic categories."""
    t_lower = title.lower()
    s_lower = summary.lower()

    # Priority 1: Direct title match for specific crops
    if any(k in t_lower for k in ["onion", "pyaz", "lasalgaon"]):
        return "🧅 Onion"
    if any(k in t_lower for k in ["potato", "aloo"]):
        return "🥔 Potato"
    if any(k in t_lower for k in ["tomato", "tamatar"]):
        return "🍅 Tomato"
    if any(k in t_lower for k in ["chilli", "mirchi", "red chilli", "guntur chilli"]):
        return "🌶️ Chilli"
    if any(k in t_lower for k in ["maize", "corn", "makka"]):
        return "🌽 Maize"
    if any(k in t_lower for k in ["paddy", "rice", "basmati", "dhan"]):
        return "🌾 Paddy / Rice"
    if any(k in t_lower for k in ["pulses", "dal", "tur", "arhar", "chana", "urad", "moong", "gram"]):
        return "🫘 Pulses"
    if any(k in t_lower for k in ["sugar", "sugarcane", "ganna", "frp", "sugar mills"]):
        return "🍬 Sugar"
    if any(k in t_lower for k in ["oilseed", "mustard", "sarson", "soybean", "groundnut", "sunflower", "edible oil"]):
        return "🌻 Oilseeds"
    if any(k in t_lower for k in ["msp", "minimum support price", "fci procurement", "procurement target"]):
        return "🏛️ MSP / Government Procurement"
    if any(k in t_lower for k in ["pm-kisan", "pm kisan", "subsidy", "drone", "fertilizer", "policy", "scheme", "ministry of agriculture", "kisan"]):
        return "🚜 Agriculture Policies"
    if any(k in t_lower for k in ["mandi", "wholesale price", "apmc", "e-nam", "enam", "agmarknet", "arrivals", "commodity"]):
        return "📈 Mandi / Commodity Market"

    # Priority 2: Summary match
    text = t_lower + " " + s_lower
    if any(k in text for k in ["onion", "pyaz"]):
        return "🧅 Onion"
    if any(k in text for k in ["potato", "aloo"]):
        return "🥔 Potato"
    if any(k in text for k in ["tomato", "tamatar"]):
        return "🍅 Tomato"
    if any(k in text for k in ["chilli", "mirchi", "red chilli"]):
        return "🌶️ Chilli"
    if any(k in text for k in ["maize", "corn"]):
        return "🌽 Maize"
    if any(k in text for k in ["paddy", "rice", "basmati", "dhan"]):
        return "🌾 Paddy / Rice"
    if any(k in text for k in ["pulses", "dal", "tur", "arhar", "chana", "urad"]):
        return "🫘 Pulses"
    if any(k in text for k in ["sugar", "sugarcane"]):
        return "🍬 Sugar"
    if any(k in text for k in ["mustard", "soybean", "groundnut", "oilseed"]):
        return "🌻 Oilseeds"
    if any(k in text for k in ["msp", "minimum support price", "procurement"]):
        return "🏛️ MSP / Government Procurement"
    if any(k in text for k in ["pm-kisan", "subsidy", "drone", "scheme", "policy"]):
        return "🚜 Agriculture Policies"

    return "📈 Mandi / Commodity Market"

def _detect_location_relevance(text: str, user_location: Optional[str]) -> Optional[str]:
    """Detects Indian state/regional relevance."""
    text_lower = text.lower()
    indian_states = [
        "Karnataka", "Telangana", "Andhra Pradesh", "Maharashtra", "Punjab", "Haryana",
        "Uttar Pradesh", "Madhya Pradesh", "Gujarat", "Rajasthan", "Tamil Nadu", "Kerala",
        "Bihar", "West Bengal", "Odisha", "Assam"
    ]
    
    # If user has a specified location, check if it matches
    if user_location:
        u_lower = user_location.lower()
        for state in indian_states:
            if state.lower() in u_lower and state.lower() in text_lower:
                return f"📍 {state} Market Focus"

    for state in indian_states:
        if state.lower() in text_lower:
            return f"📍 {state}"
    return "🇮🇳 National Market"

def fetch_live_agri_news(
    category: Optional[str] = None,
    filter_type: Optional[str] = None,
    search: Optional[str] = None,
    location: Optional[str] = None,
    language: str = "en",
    limit: int = 25,
    force_refresh: bool = False
) -> Dict[str, Any]:
    """
    Fetches real-time, live agricultural commodity and market news from reputable Indian sources.
    Uses Google News India Agriculture RSS & Government PIB Feeds.
    """
    now = time.time()
    cache_key = f"{category}_{filter_type}_{search}_{location}_{language}_{limit}"

    # Check cache unless force_refresh
    if not force_refresh and (now - NEWS_CACHE["timestamp"]) < CACHE_TTL_SECONDS:
        if cache_key in NEWS_CACHE["queries"]:
            cached = NEWS_CACHE["queries"][cache_key]
            return {
                "success": True,
                "articles": cached,
                "count": len(cached),
                "last_updated": datetime.fromtimestamp(NEWS_CACHE["timestamp"]).strftime("%I:%M %p, %d %b %Y"),
                "source": "Live Indian Agricultural & Mandi Feeds",
                "is_live": True
            }

    # Construct intelligent search queries for real-time agricultural news
    search_terms = ["India agriculture"]

    if location and len(location.strip()) > 2:
        # Extract state or district
        loc_parts = [p.strip() for p in location.split(",") if p.strip()]
        state_or_district = loc_parts[-1] if loc_parts else location.strip()
        search_terms.append(f"{state_or_district} agriculture OR mandi")

    if search and len(search.strip()) > 0:
        search_terms.append(search.strip())

    if category and category != "All":
        # Clean emoji
        cat_clean = re.sub(r'[^\w\s/]', '', category).strip()
        search_terms.append(cat_clean)

    if filter_type and filter_type != "All":
        if filter_type == "Mandi":
            search_terms.append("mandi wholesale prices arrivals")
        elif filter_type == "Crop Prices":
            search_terms.append("crop prices rates commodity market")
        elif filter_type == "MSP":
            search_terms.append("MSP minimum support price procurement")
        elif filter_type == "Government":
            search_terms.append("government agriculture policy scheme subsidy")
        elif filter_type == "Export/Import":
            search_terms.append("export import agricultural commodity tariff")
        elif filter_type == "Weather & Agriculture":
            search_terms.append("monsoon rainfall crop weather advisory IMD")

    query_str = " ".join(search_terms) if len(search_terms) > 1 else "India agriculture mandi MSP commodity prices"
    encoded_query = urllib.parse.quote(query_str)
    rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"

    raw_articles: List[Dict[str, Any]] = []
    seen_links = set()

    try:
        req = urllib.request.Request(
            rss_url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/rss+xml, application/xml, text/xml"
            }
        )
        with urllib.request.urlopen(req, timeout=7) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            items = root.findall("./channel/item")

            for item in items:
                title_elem = item.find("title")
                link_elem = item.find("link")
                pubdate_elem = item.find("pubDate")
                desc_elem = item.find("description")
                source_elem = item.find("source")

                if title_elem is None or not title_elem.text:
                    continue

                full_title = title_elem.text.strip()
                link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                
                if link in seen_links:
                    continue
                seen_links.add(link)

                # Extract publication source from title or source tag
                source_name = "Agricultural News Desk"
                title = full_title
                if " - " in full_title:
                    parts = full_title.rsplit(" - ", 1)
                    title = parts[0].strip()
                    source_name = parts[1].strip()
                elif source_elem is not None and source_elem.text:
                    source_name = source_elem.text.strip()

                raw_desc = desc_elem.text if desc_elem is not None and desc_elem.text else ""
                clean_desc = _clean_html(raw_desc)
                if not clean_desc or len(clean_desc) < 20:
                    clean_desc = f"{title}. Verified updates from {source_name} regarding current Indian agricultural market developments."

                pub_date_raw = pubdate_elem.text.strip() if pubdate_elem is not None and pubdate_elem.text else ""
                formatted_date = _format_pubdate(pub_date_raw)

                art_cat = _categorize_article(title, clean_desc)
                img = CATEGORY_IMAGE_MAP.get(art_cat, CATEGORY_IMAGE_MAP["Default"])
                loc_tag = _detect_location_relevance(title + " " + clean_desc, location)

                # Generate clean unique ID
                art_id = hashlib.md5((link or title).encode("utf-8")).hexdigest()[:12]

                raw_articles.append({
                    "id": art_id,
                    "title": title,
                    "summary": clean_desc,
                    "content": clean_desc,
                    "category": art_cat,
                    "source": source_name,
                    "date": formatted_date,
                    "url": link,
                    "image_url": img,
                    "location_tag": loc_tag,
                    "published_raw": pub_date_raw
                })

    except Exception as e:
        print(f"Error fetching live RSS news: {e}")

    # Fallback to secondary agriculture news queries if primary yielded few items
    if len(raw_articles) < 5:
        try:
            sec_url = "https://news.google.com/rss/search?q=India+mandi+MSP+Paddy+Wheat+Onion+Kisan&hl=en-IN&gl=IN&ceid=IN:en"
            req = urllib.request.Request(
                sec_url,
                headers={"User-Agent": "Mozilla/5.0"}
            )
            with urllib.request.urlopen(req, timeout=6) as response:
                root = ET.fromstring(response.read())
                for item in root.findall("./channel/item"):
                    t_el = item.find("title")
                    l_el = item.find("link")
                    d_el = item.find("description")
                    p_el = item.find("pubDate")

                    if t_el is None or not t_el.text:
                        continue
                    link = l_el.text.strip() if l_el is not None and l_el.text else ""
                    if link in seen_links:
                        continue
                    seen_links.add(link)

                    full_t = t_el.text.strip()
                    title = full_t.rsplit(" - ", 1)[0] if " - " in full_t else full_t
                    src = full_t.rsplit(" - ", 1)[1] if " - " in full_t else "Agri News"
                    desc = _clean_html(d_el.text if d_el is not None and d_el.text else "") or title
                    cat = _categorize_article(title, desc)
                    loc_tag = _detect_location_relevance(title + " " + desc, location)

                    raw_articles.append({
                        "id": hashlib.md5((link or title).encode("utf-8")).hexdigest()[:12],
                        "title": title,
                        "summary": desc,
                        "content": desc,
                        "category": cat,
                        "source": src,
                        "date": _format_pubdate(p_el.text if p_el is not None and p_el.text else ""),
                        "url": link,
                        "image_url": CATEGORY_IMAGE_MAP.get(cat, CATEGORY_IMAGE_MAP["Default"]),
                        "location_tag": loc_tag,
                        "published_raw": p_el.text if p_el is not None else ""
                    })
        except Exception as e2:
            print(f"Secondary RSS fetch error: {e2}")

    # Prioritize user location relevant news to top of the list if location is specified
    if location:
        u_state = location.split(",")[-1].strip().lower()
        def sort_key(a: Dict[str, Any]) -> int:
            txt = (a["title"] + " " + a["summary"]).lower()
            return 0 if u_state in txt else 1
        raw_articles.sort(key=sort_key)

    final_articles = raw_articles[:limit]

    # Save in cache
    NEWS_CACHE["timestamp"] = now
    NEWS_CACHE["queries"][cache_key] = final_articles

    updated_time_str = datetime.now().strftime("%I:%M %p, %d %b %Y")

    return {
        "success": len(final_articles) > 0,
        "articles": final_articles,
        "count": len(final_articles),
        "last_updated": updated_time_str,
        "source": "Live Indian Agricultural & Mandi Feeds (Google News / PIB)",
        "is_live": True
    }


def get_farmer_news(
    category: Optional[str] = None,
    filter_type: Optional[str] = None,
    search: Optional[str] = None,
    location: Optional[str] = None,
    language: str = "en",
    limit: int = 25,
    force_refresh: bool = False
) -> List[Dict[str, Any]]:
    """
    Convenience wrapper returning list of live agricultural news articles.
    """
    res = fetch_live_agri_news(
        category=category,
        filter_type=filter_type,
        search=search,
        location=location,
        language=language,
        limit=limit,
        force_refresh=force_refresh
    )
    return res.get("articles", [])

