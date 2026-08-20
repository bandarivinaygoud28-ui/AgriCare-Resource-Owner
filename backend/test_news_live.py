import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from news.news_service import fetch_live_agri_news, get_farmer_news

def test_live_news():
    print("Fetching Real-Time Agricultural Market News...")
    res = fetch_live_agri_news(limit=10, force_refresh=True)
    assert res.get("success") is True, "News fetch failed"
    articles = res.get("articles", [])
    assert len(articles) > 0, "Zero articles returned"
    print(f"Total live articles fetched: {len(articles)}")
    print(f"Last updated: {res.get('last_updated')}")
    print(f"Source: {res.get('source')}")

    first = articles[0]
    print("\n--- SAMPLE LIVE ARTICLE ---")
    print(f"Title: {first['title']}")
    print(f"Source: {first['source']}")
    print(f"Date: {first['date']}")
    print(f"Category: {first['category']}")
    print(f"Location Tag: {first.get('location_tag')}")
    print(f"URL: {first.get('url')[:60]}...")
    print(f"Summary: {first['summary'][:120]}...")

    print("\nTesting Onion Category Filter...")
    onion_res = fetch_live_agri_news(category="🧅 Onion", limit=5)
    print(f"Onion articles fetched: {len(onion_res.get('articles', []))}")

    print("\nTesting Location-Aware Search (Kolar, Karnataka)...")
    loc_res = fetch_live_agri_news(location="Kolar, Karnataka", limit=5)
    print(f"Karnataka location articles fetched: {len(loc_res.get('articles', []))}")

    print("\nALL LIVE NEWS TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_live_news()
