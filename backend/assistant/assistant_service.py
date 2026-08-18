from typing import Dict, Any, List, Optional
try:
    from market.market_service import get_market_prices
    from weather.weather_service import get_weather_data
except ImportError:
    from ..market.market_service import get_market_prices
    from ..weather.weather_service import get_weather_data

def process_assistant_query(
    message: str,
    language: str = "en", # en, te, hi
    diagnosis_context: Optional[Dict[str, Any]] = None,
    location: str = "Warangal, Telangana"
) -> Dict[str, Any]:
    """
    Intelligent agricultural assistant combining active diagnosis context,
    real-time market queries, and localized weather insights.
    """
    msg_clean = message.lower().strip()
    lang = language.lower() if language in ("en", "te", "hi") else "en"

    # 1. Check if user is asking about active diagnosis context
    if diagnosis_context and any(kw in msg_clean for kw in ["disease", "cure", "treatment", "medicine", "symptom", "spray", "prevent", "report", "leaf", "plant", "మందు", "రోగం", "నివారణ", "दवा", "रोग", "इलाज"]):
        crop = diagnosis_context.get("crop", "Crop")
        area = diagnosis_context.get("affected_area", "Plant")
        disease = diagnosis_context.get("disease", "Identified Condition")
        severity = diagnosis_context.get("severity", "Moderate")
        treatments = diagnosis_context.get("treatment", [])
        actions = diagnosis_context.get("immediate_actions", [])

        treat_text = " • " + "\n • ".join(treatments[:2]) if treatments else "Follow recommended agricultural dosage."
        action_text = " • " + "\n • ".join(actions[:2]) if actions else "Isolate infected foliage."

        if lang == "te":
            reply = (
                f"మీ {crop} ({area}) లో '{disease}' (తీవ్రత: {severity}) గుర్తించబడింది.\n\n"
                f"🚨 తక్షణ చర్యలు:\n{action_text}\n\n"
                f"💊 సిఫార్సు చేసిన నివారణ చర్యలు:\n{treat_text}\n\n"
                f"గమనిక: క్రిమిసంహారకాలు వాడే ముందు స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి."
            )
        elif lang == "hi":
            reply = (
                f"आपकी {crop} ({area}) में '{disease}' (गंभीरता: {severity}) पाई गई है।\n\n"
                f"🚨 त्वरित कदम:\n{action_text}\n\n"
                f"💊 उपचार व रोकथाम:\n{treat_text}\n\n"
                f"नोट: रासायनिक कीटनाशकों का प्रयोग करने से पहले कृषि विशेषज्ञ की सलाह लें।"
            )
        else:
            reply = (
                f"Regarding the diagnosis for your {crop} ({area}) with '{disease}' (Severity: {severity}):\n\n"
                f"🚨 Immediate Actions:\n{action_text}\n\n"
                f"💊 Recommended Management:\n{treat_text}\n\n"
                f"Tip: Ensure adequate leaf dryness and adhere strictly to product label directions."
            )

        return {"response": reply, "topic": "diagnosis", "language": lang}

    # 2. Check if user is asking about Market Prices
    detected_crop = None
    for c in ["tomato", "paddy", "rice", "cotton", "maize", "corn", "chilli", "chili", "mirchi", "potato"]:
        if c in msg_clean:
            if c in ["rice", "paddy"]:
                detected_crop = "Paddy"
            elif c in ["corn", "maize"]:
                detected_crop = "Maize"
            elif c in ["chili", "mirchi", "chilli"]:
                detected_crop = "Chilli"
            else:
                detected_crop = c.capitalize()
            break

    if any(kw in msg_clean for kw in ["price", "market", "rate", "cost", "quintal", "ధర", "మార్కెట్", "రేటు", "भाव", "दाम", "मंडी", "बाजार"]) or detected_crop:
        target_crop = detected_crop or (diagnosis_context.get("crop") if diagnosis_context else "Tomato")
        market_info = get_market_prices(crop=target_crop)
        summary = market_info.get("summary", {})
        avg_p = summary.get("average_price", 0)
        high_p = summary.get("highest_price", 0)
        low_p = summary.get("lowest_price", 0)
        updated = market_info.get("last_updated", "Recent")
        source = market_info.get("source", "Government OGD / Demo Data")

        if lang == "te":
            reply = (
                f"💰 {target_crop} మార్కెట్ ధరల తాజా వివరాలు ({updated}):\n\n"
                f"• సగటు ధర: ₹{avg_p} / క్వింటాల్\n"
                f"• గరిష్ట ధర: ₹{high_p} / క్వింటాల్\n"
                f"• కనిష్ట ధర: ₹{low_p} / క్వింటాల్\n"
                f"మూలం: {source}\n\n"
                f"సూచన: రవాణా ఖర్చులు మరియు పంట నాణ్యతను బట్టి అమ్మకం నిర్ణయం తీసుకోండి."
            )
        elif lang == "hi":
            reply = (
                f"💰 {target_crop} मंडी भाव विवरण ({updated}):\n\n"
                f"• औसत भाव: ₹{avg_p} / क्विंटल\n"
                f"• उच्चतम भाव: ₹{high_p} / क्विंटल\n"
                f"• न्यूनतम भाव: ₹{low_p} / क्विंटल\n"
                f"स्रोत: {source}\n\n"
                f"सलाह: फसल की गुणवत्ता, परिवहन लागत और स्थानीय मांग को ध्यान में रखकर ही बिक्री का निर्णय लें।"
            )
        else:
            reply = (
                f"💰 Latest Market Prices for {target_crop} (As of {updated}):\n\n"
                f"• Average Modal Price: ₹{avg_p} per quintal\n"
                f"• Highest Price: ₹{high_p} per quintal\n"
                f"• Lowest Price: ₹{low_p} per quintal\n"
                f"Source: {source}\n\n"
                f"Advisory: Consider crop grade, transport logistics, and local market demand before choosing your selling time."
            )

        return {"response": reply, "topic": "market_prices", "language": lang}

    # 3. Check if user is asking about Weather
    if any(kw in msg_clean for kw in ["weather", "rain", "temperature", "humidity", "spray weather", "వాతావరణం", "వర్షం", "ఎండ", "मौसम", "बारिश", "तापमान"]):
        weather = get_weather_data(location=location)
        curr = weather.get("current", {})
        ag_adv = weather.get("agricultural_advisory", {})
        t = curr.get("temp", 30)
        h = curr.get("humidity", 70)
        cond = curr.get("description", "Clear")
        spray_tip = ag_adv.get("spraying_advisory", "Conditions are generally normal.")

        if lang == "te":
            reply = (
                f"🌦️ {location} ప్రస్తుత వాతావరణం:\n\n"
                f"• ఉష్ణోగ్రత: {t}°C\n"
                f"• తేమ: {h}%\n"
                f"• పరిస్థితి: {cond}\n\n"
                f"🚜 వ్యవసాయ సూచన: {spray_tip}"
            )
        elif lang == "hi":
            reply = (
                f"🌦️ {location} वर्तमान मौसम स्थिति:\n\n"
                f"• तापमान: {t}°C\n"
                f"• आर्द्रता: {h}%\n"
                f"• स्थिति: {cond}\n\n"
                f"🚜 कृषि सलाह: {spray_tip}"
            )
        else:
            reply = (
                f"🌦️ Current Weather for {location}:\n\n"
                f"• Temperature: {t}°C (Feels like {curr.get('feels_like', t)}°C)\n"
                f"• Humidity: {h}%\n"
                f"• Conditions: {cond}\n\n"
                f"🚜 Agricultural Advisory: {spray_tip}"
            )

        return {"response": reply, "topic": "weather", "language": lang}

    # 4. General Agricultural Guidance
    if lang == "te":
        reply = (
            f"నమస్కారం! నేను మీ అగ్రికేర్ AI వ్యవసాయ సహాయకుడిని. నేను మీకు ఈ క్రింది విషయాలలో సహాయపడగలను:\n\n"
            f"1. 🤖 పంట తెగుళ్ల గుర్తింపు మరియు నివారణ మందుల సలహాలు\n"
            f"2. 💰 లైవ్ మార్కెట్ ధరలు (టమాట, వరి, పత్తి, మొక్కజొన్న, మిర్చి, బంగాళాదుంప)\n"
            f"3. 🌦️ వాతావరణ సూచనలు మరియు స్ప్రేయింగ్ అనుకూలత\n"
            f"4. 🚜 వ్యవసాయ యంత్రాలు & డ్రోన్ బుకింగ్\n\n"
            f"దయచేసి మీ ప్రశ్నకు సంబంధించిన వివరాలను అడగండి."
        )
    elif lang == "hi":
        reply = (
            f"नमस्ते! मैं आपका एग्रीकेयर AI किसान सहायक हूँ। मैं आपकी निम्न विषयों में मदद कर सकता हूँ:\n\n"
            f"1. 🤖 फसल रोग पहचान और सटीक उपचार सलाह\n"
            f"2. 💰 सरकारी मंडी भाव (टमाटर, धान, कपास, मक्का, मिर्च, आलू)\n"
            f"3. 🌦️ मौसम पूर्वानुमान और छिड़काव सलाह\n"
            f"4. 🚜 कृषि उपकरण और ड्रोन सेवा बुकिंग\n\n"
            f"कृपया अपना प्रश्न पूछें।"
        )
    else:
        reply = (
            f"Hello! I am your AgriCare AI Farmer Assistant. How can I help you today?\n\n"
            f"• 🤖 Ask about crop disease diagnosis, immediate actions, and treatment\n"
            f"• 💰 Inquire about current Government Market Prices for commodities\n"
            f"• 🌦️ Check local weather risks and optimal spraying windows\n"
            f"• 🚜 Book tractors, harvesters, or agricultural drone spraying services\n\n"
            f"Feel free to type your question or use voice input!"
        )

    return {"response": reply, "topic": "general", "language": lang}
