from typing import List, Dict, Any, Optional

NEWS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": 1,
        "category": "Government Schemes",
        "title_en": "PM-Kisan 18th Installment Credited to Eligible Farmers",
        "title_te": "పీఎం-కిసాన్ 18వ విడత నిధులు రైతుల ఖాతాల్లో జమ",
        "title_hi": "पीएम-किसान 18वीं किस्त पात्र किसानों के बैंक खातों में जारी",
        "summary_en": "The Ministry of Agriculture has disbursed direct benefit transfer (DBT) funds of ₹2,000 under the PM-Kisan scheme to over 9.5 crore eligible farmers across India.",
        "summary_te": "దేశవ్యాప్తంగా 9.5 కోట్లకు పైగా అర్హులైన రైతుల బ్యాంకు ఖాతాల్లో పీఎం-కిసాన్ పథకం కింద ₹2,000 డీబీటీ ద్వారా నేరుగా జమ చేయబడ్డాయి.",
        "summary_hi": "कृषि मंत्रालय ने पीएम-किसान योजना के तहत देश के 9.5 करोड़ से अधिक पात्र किसानों को ₹2,000 की डीबीटी राशि सीधे बैंक खातों में भेजी।",
        "source": "Ministry of Agriculture & Farmers Welfare",
        "date": "18 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80",
        "content_en": "Farmers are advised to verify their e-KYC status and Aadhaar-seeded bank account links on the official PM-Kisan portal to ensure smooth receipt of subsequent installments. Common Service Centers (CSCs) are facilitating free biometric verification."
    },
    {
        "id": 2,
        "category": "New Farming Technologies",
        "title_en": "Kisan Drone Subsidy Scheme Expanded for Precision Spraying",
        "title_te": "డ్రోన్ స్ప్రేయింగ్ కోసం కిసాన్ డ్రోన్ సబ్సిడీ పథకం విస్తరణ",
        "title_hi": "सटीक छिड़काव के लिए किसान ड्रोन सब्सिडी योजना का विस्तार",
        "summary_en": "State agricultural departments announced a 50% subsidy (up to ₹5 Lakh) on certified agricultural spraying drones for Farmer Producer Organizations (FPOs) and custom hiring centers.",
        "summary_te": "రైతు ఉత్పత్తి సంఘాలు (FPOలు) మరియు అద్దె కేంద్రాల కోసం వ్యవసాయ డ్రోన్లపై 50% సబ్సిడీని ప్రభుత్వం ప్రకటించింది.",
        "summary_hi": "राज्य कृषि विभागों ने किसान उत्पादक संगठनों (FPO) और कस्टम हायरिंग केंद्रों के लिए कृषि ड्रोन पर 50% सब्सिडी की घोषणा की।",
        "source": "ICAR Agricultural Technology News",
        "date": "17 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
        "content_en": "Agricultural drones reduce chemical usage by up to 30%, minimize water requirements by 80%, and complete spraying of 1 acre within 7 to 10 minutes, protecting farmer health from direct pesticide exposure."
    },
    {
        "id": 3,
        "category": "Weather & Agriculture Alerts",
        "title_en": "IMD Issues Monsoon Advisory for Cotton and Paddy Belts",
        "title_te": "పత్తి, వరి రైతులకు వాతావరణ శాఖ (IMD) వర్షపాత హెచ్చరిక",
        "title_hi": "कपास और धान उत्पादक क्षेत्रों के लिए मौसम विभाग का अलर्ट",
        "summary_en": "Moderate to heavy showers predicted over central and southern agricultural zones over the next 72 hours. Farmers advised to ensure proper drainage in standing cotton and maize fields.",
        "summary_te": "రానున్న 72 గంటల్లో మోస్తరు నుండి భారీ వర్షాలు కురిసే అవకాశం ఉన్నందున పత్తి, మొక్కజొన్న చేలల్లో నీరు నిలవకుండా డ్రైనేజీ కాలువలు తీయాలని సూచన.",
        "summary_hi": "अगले 72 घंटों में मध्यम से भारी बारिश की संभावना। कपास और मक्का के खेतों में जलभराव रोकने के लिए उचित जल निकासी सुनिश्चित करें।",
        "source": "India Meteorological Department (IMD)",
        "date": "16 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80",
        "content_en": "Excess field moisture can induce root asphyxiation and collar rot in cotton. Postpone nitrogen top-dressing and chemical sprays until rain spells subside."
    },
    {
        "id": 4,
        "category": "Fertilizer & Seed Updates",
        "title_en": "Nano Urea Plus and Bio-Stimulant Distribution Centers Active",
        "title_te": "నానో యూరియా ప్లస్ మరియు బయో-ఎరువుల పంపిణీ కేంద్రాలు ప్రారంభం",
        "title_hi": "नैनो यूरिया प्लस और जैव-उर्वरक वितरण केंद्र सक्रिय",
        "summary_en": "IFFCO and primary cooperative societies have deployed adequate stocks of Nano Urea (liquid) 500 ml bottles as an eco-friendly alternative to conventional bagged urea.",
        "summary_te": "ప్రాథమిక వ్యవసాయ సహకార సంఘాల్లో నానో యూరియా ద్రావణం సీసాలు అందుబాటులో ఉంచబడ్డాయి. ఇది పంట దిగుబడిని పెంచుతుంది.",
        "summary_hi": "सहकारी समितियों में नैनो यूरिया तरल की पर्याप्त उपलब्धता सुनिश्चित की गई है। एक बोतल एक बोरी यूरिया के बराबर पोषण प्रदान करती है।",
        "source": "Department of Fertilizers",
        "date": "15 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80",
        "content_en": "Nano Urea foliar application @ 4 ml/L water during active tillering stage enhances nitrogen use efficiency to over 80%, compared to 30-40% for conventional soil-applied granular urea."
    },
    {
        "id": 5,
        "category": "Market Updates",
        "title_en": "New Electronic Mandi (e-NAM) Integration Boosts Inter-State Trade",
        "title_te": "ఈ-నామ్ (e-NAM) ద్వారా ఇతర రాష్ట్రాల మార్కెట్లకు పంట అమ్మకం సులభతరం",
        "title_hi": "ई-नाम (e-NAM) से अंतर-राज्यीय कृषि व्यापार को मिला नया बढ़ावा",
        "summary_en": "Over 1,400 agricultural produce market committees (APMCs) are now live on e-NAM, enabling farmers to receive competitive bids from buyers across multiple states.",
        "summary_te": "దేశవ్యాప్తంగా 1,400 కి పైగా మార్కెట్ యార్డులు ఈ-నామ్ తో అనుసంధానించబడ్డాయి, దీని ద్వారా రైతులకు పోటీ ధరలు లభిస్తున్నాయి.",
        "summary_hi": "1,400 से अधिक मंडियों को ई-नाम से जोड़ा गया है, जिससे किसानों को देश भर के व्यापारियों से अपनी उपज के बेहतर दाम मिल रहे हैं।",
        "source": "e-NAM National Portal",
        "date": "14 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
        "content_en": "Farmers with assayed quality certificates are realizing 10-15% higher modal realizations for chillies, cotton, and turmeric through online competitive bidding."
    },
    {
        "id": 6,
        "category": "Crop & Farming Updates",
        "title_en": "Integrated Pest Management (IPM) Advisory for Kharif Crops",
        "title_te": "ఖరీఫ్ పంటలకు సమగ్ర సస్యరక్షణ (IPM) యాజమాన్య పద్ధతులు",
        "title_hi": "खरीफ फसलों के लिए एकीकृत कीट प्रबंधन (आईपीएम) सलाह",
        "summary_en": "Agricultural universities recommend installing pheromone traps and light traps before resorting to synthetic chemical pesticides for pink bollworm and stem borer control.",
        "summary_te": "పత్తిలో గులాబీ రంగు పురుగు, వరిలో కాండం తొలిచే పురుగు నివారణకు లింగాకర్షక బుట్టలు ఏర్పాటు చేసుకోవాలని సూచన.",
        "summary_hi": "गुलाबी सुंडी और तना छेदक कीटों की रोकथाम के लिए रासायनिक कीटनाशकों से पहले फेरोमोन ट्रैप लगाने की सलाह।",
        "source": "State Agricultural University (PJTSAU)",
        "date": "13 Aug 2026",
        "image_url": "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=600&auto=format&fit=crop&q=80",
        "content_en": "Biological control using Trichogramma egg parasitoids @ 50,000/acre provides cost-effective suppression of early-stage lepidopteran pests."
    }
]

def get_farmer_news(
    category: Optional[str] = None,
    language: str = "en",
    search: Optional[str] = None,
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Returns localized agricultural news with category filtering and text search.
    """
    lang = language.lower() if language in ("en", "te", "hi") else "en"
    results = []

    for item in NEWS_DATABASE:
        # Category filter
        if category and category.lower() != "all" and item["category"].lower() != category.lower():
            continue

        # Language-selected title and summary
        title = item.get(f"title_{lang}") or item.get("title_en")
        summary = item.get(f"summary_{lang}") or item.get("summary_en")
        content = item.get(f"content_{lang}") or item.get("content_en")

        # Search filter
        if search:
            q = search.lower()
            if q not in title.lower() and q not in summary.lower() and q not in item["category"].lower():
                continue

        results.append({
            "id": item["id"],
            "category": item["category"],
            "title": title,
            "summary": summary,
            "content": content,
            "source": item["source"],
            "date": item["date"],
            "image_url": item["image_url"]
        })

    return results[:limit]
