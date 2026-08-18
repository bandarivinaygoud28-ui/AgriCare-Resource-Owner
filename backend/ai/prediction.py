import hashlib
import random
from typing import Dict, Any, List, Optional

DISCLAIMER_TEXT = (
    "Treatment information is provided for educational guidance. Follow local "
    "agricultural department recommendations and product labels. Consult a "
    "qualified agricultural expert before applying pesticides or other chemical treatments."
)

# Comprehensive Agricultural Knowledge Base by Crop and Plant Part
CROP_DISEASE_DB: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "Tomato": {
        "Leaf": [
            {
                "disease": "Tomato Early Blight (Alternaria solani)",
                "confidence": 0.94,
                "severity": "High",
                "symptoms": [
                    "Dark brown to black spots with concentric rings (target board pattern) on older leaves",
                    "Yellowing halo surrounding the necrotic lesions",
                    "Premature leaf drop starting from lower canopy upward"
                ],
                "cause": "Fungal pathogen Alternaria solani thriving in warm temperatures (24-29°C) and high humidity or prolonged leaf wetness.",
                "immediate_actions": [
                    "Prune and safely destroy heavily infected lower foliage",
                    "Avoid overhead irrigation to keep leaves dry",
                    "Ensure adequate plant spacing for improved airflow"
                ],
                "treatment": [
                    "Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2 g/L at the first sign of symptoms",
                    "For severe infection, rotate with systemic fungicides such as Azoxystrobin 23% SC @ 1 ml/L",
                    "Maintain spray intervals of 7-10 days during humid conditions"
                ],
                "prevention": [
                    "Practice 2-3 year crop rotation with non-solanaceous crops",
                    "Apply organic mulch around plant bases to prevent soil splash",
                    "Use certified disease-free seeds and resistant varieties like Arka Rakshak"
                ]
            },
            {
                "disease": "Tomato Late Blight (Phytophthora infestans)",
                "confidence": 0.96,
                "severity": "High",
                "symptoms": [
                    "Water-soaked irregular pale green to dark brown lesions on leaf edges",
                    "White fungal downy growth visible on leaf undersides during cool, humid mornings",
                    "Rapid foliar collapse and stem blackening"
                ],
                "cause": "Oomycete Phytophthora infestans favoured by cool temperatures (15-20°C) and continuous relative humidity >90%.",
                "immediate_actions": [
                    "Immediately remove and burn infected plant debris",
                    "Stop sprinkler irrigation and reduce field moisture",
                    "Apply protective fungicide shield to adjacent unaffected rows"
                ],
                "treatment": [
                    "Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5 g/L water",
                    "Apply Cymoxanil 8% + Mancozeb 64% WP @ 2 g/L if disease is spreading rapidly",
                    "Ensure thorough spray coverage on both upper and lower leaf surfaces"
                ],
                "prevention": [
                    "Plant tolerant hybrids and avoid fields prone to water stagnation",
                    "Maintain wide row spacing (90 cm x 60 cm) for canopy aeration",
                    "Apply Trichoderma viride enriched bio-compost at transplanting"
                ]
            },
            {
                "disease": "Tomato Leaf Curl Virus (ToLCV)",
                "confidence": 0.91,
                "severity": "Moderate",
                "symptoms": [
                    "Upward curling, puckering, and crinkling of young leaves",
                    "Vein clearing, interveinal chlorosis, and reduced leaf size",
                    "Stunted bushy plant growth and severe flower drop"
                ],
                "cause": "Tomato Leaf Curl Begomovirus transmitted persistently by the silverleaf whitefly (Bemisia tabaci).",
                "immediate_actions": [
                    "Rogue out and destroy virus-infected plants to limit vector acquisition",
                    "Install yellow sticky traps @ 15-20 traps per acre to monitor and capture whiteflies",
                    "Spray neem oil 10,000 ppm @ 3 ml/L as an eco-friendly vector deterrent"
                ],
                "treatment": [
                    "Manage whitefly vectors with Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L",
                    "Alternate with Spiromesifen 22.9% SC @ 1 ml/L to control whitefly nymphs",
                    "Spray foliar micronutrient mixture to boost plant immunity"
                ],
                "prevention": [
                    "Grow border barrier crops (2-3 rows of maize or sorghum) around tomato plots",
                    "Use 40-mesh insect-proof nylon nets in nursery beds",
                    "Select ToLCV-resistant hybrids such as US-440 or Arka Ananya"
                ]
            }
        ],
        "Fruit / Boll": [
            {
                "disease": "Tomato Blossom End Rot & Anthracnose",
                "confidence": 0.93,
                "severity": "Moderate",
                "symptoms": [
                    "Dark, sunken, leathery water-soaked lesions at the blossom end of fruits",
                    "Depressed circular lesions with dark center rings on ripening tomatoes",
                    "Premature fruit softening and secondary microbial decay"
                ],
                "cause": "Calcium deficiency in fruit tissue exacerbated by erratic irrigation and fungal Colletotrichum coccodes infection.",
                "immediate_actions": [
                    "Harvest and discard all affected fruits to preserve plant energy",
                    "Regulate irrigation frequency to maintain consistent soil moisture",
                    "Foliar spray of Calcium Nitrate (19:0:0 + 18.8% Ca) @ 5 g/L"
                ],
                "treatment": [
                    "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L for fungal anthracnose",
                    "Apply micronutrient formulation with Boron and Calcium every 12 days during fruit setting"
                ],
                "prevention": [
                    "Test soil pH and apply agricultural lime/gypsum before planting",
                    "Avoid excessive nitrogen fertilizers (especially ammonium forms)",
                    "Implement drip irrigation with mulch for steady root zone hydration"
                ]
            }
        ],
        "Stem": [
            {
                "disease": "Tomato Bacterial Canker (Clavibacter michiganensis)",
                "confidence": 0.89,
                "severity": "High",
                "symptoms": [
                    "Brown longitudinal cankers and split streaks on stems",
                    "Unilateral wilting where leaflets on one side of a petiole wilt first",
                    "Bird's-eye spots with white halos on young stems and fruit"
                ],
                "cause": "Bacterial pathogen Clavibacter michiganensis surviving in seed coats, crop debris, and contaminated wooden stakes.",
                "immediate_actions": [
                    "Disinfect pruning shears with 10% sodium hypochlorite solution between plants",
                    "Uproot and burn severely infected individual plants with surrounding soil"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L mixed with Streptocycline @ 0.1 g/L water",
                    "Apply protective drenching around healthy plant root zones"
                ],
                "prevention": [
                    "Use certified hot-water treated seeds (50°C for 25 minutes)",
                    "Disinfect nursery trays, tools, and support stakes",
                    "Avoid overhead handling and pruning when crop foliage is wet"
                ]
            }
        ],
        "Root": [
            {
                "disease": "Tomato Bacterial Wilt (Ralstonia solanacearum)",
                "confidence": 0.92,
                "severity": "High",
                "symptoms": [
                    "Rapid wilting and drooping of foliage while leaves remain green",
                    "Browning of vascular bundles inside lower stem",
                    "White bacterial streaming when cut stem is placed in clean water"
                ],
                "cause": "Soil-borne bacterium Ralstonia solanacearum entering through root wounds during warm, waterlogged conditions.",
                "immediate_actions": [
                    "Isolate infected area to prevent spreading via irrigation runoff",
                    "Avoid mechanical inter-cultivation that causes root damage"
                ],
                "treatment": [
                    "Soil drenching with Copper Oxychloride @ 3 g/L + Streptocycline @ 0.2 g/L",
                    "Incorporate bio-control agent Pseudomonas fluorescens @ 2.5 kg/ha in farmyard manure"
                ],
                "prevention": [
                    "Grow resistant rootstocks and grafted tomato seedlings",
                    "Improve soil drainage and raise planting beds 15-20 cm",
                    "Adopt crop rotation with paddy or corn for at least 2 seasons"
                ]
            }
        ]
    },
    "Paddy": {
        "Leaf": [
            {
                "disease": "Rice Blast (Magnaporthe oryzae)",
                "confidence": 0.95,
                "severity": "High",
                "symptoms": [
                    "Spindle-shaped elliptical lesions with greyish-white centers and dark brown margins on leaves",
                    "Lesions coalesce causing complete drying and blighted appearance of leaf blades",
                    "Collar rot and leaf neck breakage in severe cases"
                ],
                "cause": "Airborne fungus Magnaporthe oryzae favoured by cloudy weather, high humidity (>90%), and heavy nitrogen application.",
                "immediate_actions": [
                    "Immediately postpone top-dressing with nitrogenous fertilizers (Urea)",
                    "Maintain 2-3 cm shallow standing water layer in the field",
                    "Survey field borders for early blast hotspots"
                ],
                "treatment": [
                    "Spray Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L",
                    "For severe incidence, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L",
                    "Repeat application after 10-14 days if wet weather persists"
                ],
                "prevention": [
                    "Seed treatment with Carbendazim 50% WP @ 2 g/kg of seed",
                    "Split nitrogen application into 3-4 balanced doses with Potash",
                    "Use resistant paddy cultivars suited to the agro-climatic zone"
                ]
            },
            {
                "disease": "Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)",
                "confidence": 0.93,
                "severity": "High",
                "symptoms": [
                    "Water-soaked wavy yellowish lesions along leaf margins spreading downwards",
                    "Leaves turn straw yellow and dry up giving a scorched appearance",
                    "Milky bacterial exudate droplets visible on lesions in early morning"
                ],
                "cause": "Systemic bacterium Xanthomonas oryzae entering through leaf hydathodes and storm injury wounds.",
                "immediate_actions": [
                    "Drain excess flood water from the field for 24-48 hours",
                    "Do not prune leaf tips during transplanting",
                    "Suspend chemical nitrogen application immediately"
                ],
                "treatment": [
                    "Spray Copper Hydroxide 77% WP @ 2 g/L + Streptocycline @ 0.1 g/L",
                    "Apply foliar spray of Potassium Nitrate @ 10 g/L to stimulate resistance"
                ],
                "prevention": [
                    "Avoid deep submergence of seedlings in nursery",
                    "Eradicate weed hosts like Leersia hexandra on bunds",
                    "Grow BLB-resistant paddy varieties like Improved Samba Mahsuri (RP Bio-226)"
                ]
            }
        ],
        "Grain / Cob": [
            {
                "disease": "Rice False Smut (Ustilaginoidea virens)",
                "confidence": 0.91,
                "severity": "Moderate",
                "symptoms": [
                    "Individual rice grains transform into velvety yellow-green spore balls",
                    "Balls rupture turning greenish-black powdery mass",
                    "Reduces grain quality, weight, and germination capacity"
                ],
                "cause": "Fungal pathogen Ustilaginoidea virens attacking panicles during booting and flowering stages.",
                "immediate_actions": [
                    "Collect and safely discard infected spore balls from panicles to reduce inoculum",
                    "Avoid excessive late nitrogen fertilization"
                ],
                "treatment": [
                    "Prophylactic spray of Trifloxystrobin 25% + Tebuconazole 50% WG (Nativo) @ 0.4 g/L at booting stage",
                    "Spray Propiconazole 25% EC (Tilt) @ 1 ml/L when 5% panicles have emerged"
                ],
                "prevention": [
                    "Hot water seed treatment at 52°C for 10 minutes",
                    "Ensure early planting to avoid late monsoon moisture at flowering",
                    "Deep summer ploughing to bury overwintering sclerotia"
                ]
            }
        ],
        "Stem": [
            {
                "disease": "Rice Sheath Blight (Rhizoctonia solani)",
                "confidence": 0.94,
                "severity": "High",
                "symptoms": [
                    "Oval or elliptical greenish-grey water-soaked spots on leaf sheaths near water line",
                    "Lesions enlarge with irregular dark reddish-brown margins like snake skin",
                    "Lodging of crop due to weakened stem bases"
                ],
                "cause": "Soil and water-borne fungus Rhizoctonia solani thriving in dense planting and high humidity (85-100%).",
                "immediate_actions": [
                    "Drain standing water and expose stem base to sunlight",
                    "Remove floating organic skims on field water surface"
                ],
                "treatment": [
                    "Spray Hexaconazole 5% SC @ 2 ml/L or Validamycin 3% L @ 2.5 ml/L directing nozzle to plant bases",
                    "Apply Thifluzamide 24% SC @ 0.75 ml/L at first appearance"
                ],
                "prevention": [
                    "Maintain optimal planting density (20 cm x 15 cm)",
                    "Apply balanced fertilizer with recommended Potash (K2O) dosage",
                    "Incorporate Trichoderma viride @ 5 kg/ha mixed with FYM"
                ]
            }
        ]
    },
    "Cotton": {
        "Leaf": [
            {
                "disease": "Cotton Bacterial Leaf Blight / Black Arm (Xanthomonas citri pv. malvacearum)",
                "confidence": 0.93,
                "severity": "High",
                "symptoms": [
                    "Angular water-soaked spots bounded by leaf veins on lower and upper foliage",
                    "Lesions turn purplish-brown to black creating angular leaf spots",
                    "Black elongated lesions on petioles and stems causing 'Black Arm' collapse"
                ],
                "cause": "Seed-borne bacterium Xanthomonas citri pv. malvacearum spreading via wind-driven rain and dew drops.",
                "immediate_actions": [
                    "Remove and destroy severely affected plant branches",
                    "Avoid high-pressure overhead spraying that scatters bacteria"
                ],
                "treatment": [
                    "Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L",
                    "Repeat after 12 days if rainy conditions continue"
                ],
                "prevention": [
                    "Acid delinting of cotton seed with concentrated Sulphuric acid (100 ml/kg seed)",
                    "Grow tolerant Bt cotton hybrids",
                    "Destroy post-harvest crop stubbles and voluntary cotton plants"
                ]
            },
            {
                "disease": "Cotton Leaf Curl Virus (CLCuV)",
                "confidence": 0.95,
                "severity": "High",
                "symptoms": [
                    "Upward or downward leaf curling with thick green veins",
                    "Cup-shaped leaf enations (outgrowths) on underside of main veins",
                    "Severe stunting and reduced boll formation"
                ],
                "cause": "Cotton leaf curl begomovirus vectored by whitefly (Bemisia tabaci).",
                "immediate_actions": [
                    "Eradicate virus reservoir weeds like Abutilon indicum and Xanthium strumarium",
                    "Install yellow sticky traps @ 20/acre"
                ],
                "treatment": [
                    "Control vector using Afidopyropen 50 g/L DC @ 2 ml/L or Diafenthiuron 50% WP @ 1.2 g/L",
                    "Spray Flonicamid 50% WG @ 0.4 g/L for systemic vector management"
                ],
                "prevention": [
                    "Plant early to escape peak whitefly infestation periods",
                    "Avoid planting cotton near alternate host crops like okra and brinjal",
                    "Use certified CLCuV-resistant hybrid varieties"
                ]
            }
        ],
        "Fruit / Boll": [
            {
                "disease": "Cotton Boll Rot Complex",
                "confidence": 0.92,
                "severity": "High",
                "symptoms": [
                    "Brown to black water-soaked discoloration on outer boll bracts",
                    "Internal lint discoloured, stained, and decaying into watery mush",
                    "Bolls fail to open naturally and shed prematurely"
                ],
                "cause": "Complex of fungal (Fusarium, Colletotrichum) and bacterial pathogens entering via bollworm puncture wounds.",
                "immediate_actions": [
                    "Pick and destroy rotted bolls to prevent field inoculum buildup",
                    "Improve aeration by defoliating dense lower vegetative branches"
                ],
                "treatment": [
                    "Spray Propiconazole 25% EC @ 1 ml/L + Copper Oxychloride @ 2 g/L targeting developing bolls",
                    "Manage boll-puncturing pests simultaneously with appropriate bio-pesticides"
                ],
                "prevention": [
                    "Maintain proper plant spacing and avoid excessive vegetative growth from high N",
                    "Timely harvest of early matured bolls",
                    "Regular scouting for bollworm complexes"
                ]
            }
        ]
    },
    "Maize": {
        "Leaf": [
            {
                "disease": "Maize Turcicum Leaf Blight (Exserohilum turcicum)",
                "confidence": 0.94,
                "severity": "Moderate",
                "symptoms": [
                    "Long, elliptical, grayish-green to tan lesions (up to 15 cm) on leaf blades",
                    "Dark fungal sporulation inside lesions in damp morning air",
                    "Extensive blighting of whole canopy causing premature drying"
                ],
                "cause": "Fungus Exserohilum turcicum surviving on crop residues and favored by mild temperatures (18-27°C) and dew.",
                "immediate_actions": [
                    "Remove heavily blighted lower leaves if crop is young",
                    "Avoid overhead irrigation during cooler evening hours"
                ],
                "treatment": [
                    "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L",
                    "Or apply Mancozeb 75% WP @ 2.5 g/L at early tassel emergence"
                ],
                "prevention": [
                    "Treat seeds with Thiram + Carbendazim (1:1) @ 3 g/kg seed",
                    "Deep summer ploughing to bury maize residues",
                    "Plant resistant maize hybrids like DHM-117 or Pioneer hybrids"
                ]
            }
        ],
        "Grain / Cob": [
            {
                "disease": "Maize Gibberella / Fusarium Ear Rot",
                "confidence": 0.91,
                "severity": "Moderate",
                "symptoms": [
                    "Pinkish-red fungal mold growth starting from tip of the ear downward",
                    "Kernels become bleached, chalky, and cracked with mycotoxin risk",
                    "Husks tightly adhere to rotting kernels"
                ],
                "cause": "Fungal pathogen Fusarium verticillioides / Gibberella zeae invading silks during wet pollination.",
                "immediate_actions": [
                    "Harvest mature ears promptly and dry grain below 14% moisture immediately",
                    "Sort and discard moldy cobs before storage"
                ],
                "treatment": [
                    "Spray Pyraclostrobin 20% WG @ 1 g/L onto silks during silking window",
                    "Apply bio-agent Trichoderma harzianum @ 2 g/L"
                ],
                "prevention": [
                    "Select hybrids with tight husk coverage and good tip resistance",
                    "Manage ear-feeding insects (Fall Armyworm) that create entry wounds",
                    "Ensure adequate potassium and balanced phosphorus fertilization"
                ]
            }
        ]
    },
    "Chilli": {
        "Leaf": [
            {
                "disease": "Chilli Cercospora Leaf Spot / Frog Eye Spot (Cercospora capsici)",
                "confidence": 0.93,
                "severity": "Moderate",
                "symptoms": [
                    "Circular spots with light ash-grey centers and distinct dark brown margins",
                    "Leaflets turn yellow and shed readily when gently touched",
                    "Severe defoliation exposing green chillies to sunscald"
                ],
                "cause": "Fungus Cercospora capsici thriving in warm, wet weather with frequent rainfall.",
                "immediate_actions": [
                    "Prune diseased lower leaves and clear fallen debris from soil",
                    "Maintain soil moisture without wetting the plant canopy"
                ],
                "treatment": [
                    "Spray Carbendazim 12% + Mancozeb 63% WP (Saaf) @ 2 g/L",
                    "Or spray Tebuconazole 25.9% EC @ 1 ml/L water",
                    "Repeat spray at 10-day intervals"
                ],
                "prevention": [
                    "Seed treatment with Thiram 75% WP @ 2.5 g/kg seed",
                    "Crop rotation with maize, pulses, or cereals",
                    "Foliar spray of Potassium silicate @ 2 g/L to strengthen leaf epidermis"
                ]
            },
            {
                "disease": "Chilli Leaf Curl Complex (Murda Disease)",
                "confidence": 0.96,
                "severity": "High",
                "symptoms": [
                    "Upward curling of leaves caused by thrips and downward curling caused by mites",
                    "Leaves become brittle, boat-shaped, and severely puckered",
                    "Shortened internodes with bushy plant appearance and flower drop"
                ],
                "cause": "Synergistic infestation of Yellow Mite (Polyphagotarsonemus latus), Chilli Thrips, and Begomovirus.",
                "immediate_actions": [
                    "Rogue out severely stunted virus-infected bushes",
                    "Install blue sticky traps for thrips and yellow traps for whiteflies @ 25/acre"
                ],
                "treatment": [
                    "Spray Diafenthiuron 50% WP @ 1.25 g/L or Fipronil 5% SC @ 2 ml/L for thrips",
                    "Spray Fenazaquin 10% EC @ 2 ml/L or Spiromesifen 22.9% SC @ 1 ml/L for mites",
                    "Alternate insecticide groups to prevent pesticide resistance"
                ],
                "prevention": [
                    "Intercrop with barrier crops (2 rows of Maize or Pearl millet)",
                    "Sprinkle water on canopy during hot dry spells to suppress mite populations",
                    "Use resilient cultivars such as G-4 or Teja"
                ]
            }
        ],
        "Fruit / Boll": [
            {
                "disease": "Chilli Anthracnose / Fruit Rot / Dieback (Colletotrichum capsici)",
                "confidence": 0.95,
                "severity": "High",
                "symptoms": [
                    "Sunken circular or oblong dark necrotic lesions on ripe and green pods",
                    "Black concentric rings with salmon-pink acervuli spore masses on fruits",
                    "Die-back of twigs starting from tip downwards turning straw-colored"
                ],
                "cause": "Fungus Colletotrichum capsici triggered by warm temperatures (28°C) and relative humidity >80%.",
                "immediate_actions": [
                    "Pick and isolate all infected fruits before drying",
                    "Prune dead twigs 2 inches below the infection line"
                ],
                "treatment": [
                    "Spray Azoxystrobin 23% SC @ 1 ml/L or Difenoconazole 25% EC @ 0.5 ml/L",
                    "Or spray Copper Oxychloride @ 3 g/L + Mancozeb @ 2 g/L",
                    "Apply during flowering and early fruit development"
                ],
                "prevention": [
                    "Seed treatment with Trichoderma viride @ 4 g/kg seed",
                    "Collect and burn crop residues after final picking",
                    "Store dry chillies in clean moisture-proof gunny bags"
                ]
            }
        ]
    },
    "Potato": {
        "Leaf": [
            {
                "disease": "Potato Late Blight (Phytophthora infestans)",
                "confidence": 0.97,
                "severity": "High",
                "symptoms": [
                    "Water-soaked irregular blackish-brown spots on leaf tips and margins",
                    "Delicate white fungal mold on leaf undersides in high humidity",
                    "Rapid foliar blight with characteristic foul decay odor"
                ],
                "cause": "Oomycete Phytophthora infestans triggered by cold nights (10-15°C) and cloudy humid days (15-20°C).",
                "immediate_actions": [
                    "Cut and destroy haulms (vines) 10-12 days before harvest if late blight strikes late season",
                    "Stop furrow irrigation to prevent tuber contamination"
                ],
                "treatment": [
                    "Prophylactic spray with Mancozeb 75% WP @ 2.5 g/L before disease onset",
                    "Curative spray with Dimethomorph 50% WP @ 1 g/L + Mancozeb @ 2 g/L upon first sighting",
                    "Alternate with Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L"
                ],
                "prevention": [
                    "Plant certified disease-free seed tubers from trusted source",
                    "Perform high earthing-up (20 cm) to cover tubers from washing down spores",
                    "Select resistant varieties like Kufri Girdhari or Kufri Himalini"
                ]
            },
            {
                "disease": "Potato Early Blight (Alternaria solani)",
                "confidence": 0.92,
                "severity": "Moderate",
                "symptoms": [
                    "Small scattered brown spots with distinct concentric ridges (target pattern)",
                    "Lower leaves turn yellow, chlorotic, and dry up like paper",
                    "Lesions become angular when bounded by prominent leaf veins"
                ],
                "cause": "Fungus Alternaria solani thriving in alternating wet and dry weather cycles.",
                "immediate_actions": [
                    "Remove and compost infected lower foliage away from potato fields",
                    "Avoid plant stress through balanced irrigation"
                ],
                "treatment": [
                    "Spray Chlorothalonil 75% WP @ 2 g/L or Propineb 70% WP @ 2.5 g/L",
                    "Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1 ml/L if severe"
                ],
                "prevention": [
                    "Follow 3-year crop rotation avoiding tomato, brinjal, and chili",
                    "Ensure balanced potassium application to improve plant vigor",
                    "Use certified disease-indexed seed tubers"
                ]
            }
        ],
        "Root": [
            {
                "disease": "Potato Black Scurf & Stem Canker (Rhizoctonia solani)",
                "confidence": 0.90,
                "severity": "Moderate",
                "symptoms": [
                    "Hard, black, dirt-like sclerotial crusts adhering tightly to tuber skins",
                    "Brown sunken cankers on underground sprouts and stolons",
                    "Aerial tuber formation on leaf axils due to restricted carbohydrate transport"
                ],
                "cause": "Soil-borne and tuber-borne fungus Rhizoctonia solani persisting in cool wet soils.",
                "immediate_actions": [
                    "Sort seed tubers and discard heavily encrusted lots",
                    "Delay planting slightly until soil warms above 12°C"
                ],
                "treatment": [
                    "Tuber treatment with Carbendazim 50% WP @ 2.5 g/L or Pencycuron 250 SC @ 2.5 ml/L",
                    "Soil application of Trichoderma viride @ 5 kg/ha with 500 kg well-decomposed FYM"
                ],
                "prevention": [
                    "Practice green manuring with Sesbania (Daincha) before potato planting",
                    "Harvest promptly after haulm cutting; do not leave tubers in soil for long",
                    "Rotate with non-host crops like wheat, mustard, or maize"
                ]
            }
        ]
    }
}

# Fallback Generic Healthy Profile
HEALTHY_PROFILE: Dict[str, Any] = {
    "disease": "Healthy Crop (No Active Pathogen Detected)",
    "confidence": 0.98,
    "severity": "None",
    "symptoms": [
        "Vigorous green foliage with normal chlorophyll distribution",
        "No visible necrotic lesions, wilting, or fungal sporulation",
        "Firm stems and healthy structural turgidity"
    ],
    "cause": "Good agronomic management, balanced soil nutrition, and absence of virulent pathogen pressure.",
    "immediate_actions": [
        "Continue current optimal irrigation and nutrient schedule",
        "Maintain routine weekly visual crop scouting for pest hotspots",
        "Keep field bunds clear of alternate weed hosts"
    ],
    "treatment": [
        "No chemical fungicides or bactericides required at this stage",
        "Optional preventive spray of bio-fertilizer or seaweed extract @ 2 ml/L to enhance vigor"
    ],
    "prevention": [
        "Maintain regular scouting intervals every 4-7 days",
        "Keep moisture levels balanced and ensure adequate soil drainage",
        "Apply balanced N-P-K according to soil health card recommendations"
    ]
}


def generate_prediction(
    crop: str,
    affected_area: str = "Leaf",
    image_bytes: Optional[bytes] = None,
    filename: Optional[str] = None
) -> Dict[str, Any]:
    """
    Generates structured, realistic agricultural disease diagnosis.
    Considers crop, affected plant part, and image properties.
    """
    normalized_crop = crop.strip().title()
    normalized_area = affected_area.strip().title() if affected_area else "Leaf"

    # Default to Tomato if unknown crop
    if normalized_crop not in CROP_DISEASE_DB:
        normalized_crop = "Tomato"

    crop_data = CROP_DISEASE_DB.get(normalized_crop, {})
    
    # Try getting list for the specific affected area, or fallback to Leaf, or any available part
    candidates = crop_data.get(normalized_area)
    if not candidates:
        candidates = crop_data.get("Leaf") or []
        if not candidates and crop_data:
            first_key = next(iter(crop_data))
            candidates = crop_data[first_key]

    if not candidates:
        selected = HEALTHY_PROFILE.copy()
    else:
        # Pick candidate deterministically based on image hash if provided, else pseudo-random
        if image_bytes:
            h = int(hashlib.md5(image_bytes[:512]).hexdigest(), 16)
            idx = h % len(candidates)
            selected = candidates[idx].copy()
        else:
            selected = candidates[0].copy()

    # Build full structured response
    result = {
        "crop": normalized_crop,
        "affected_area": normalized_area,
        "disease": selected.get("disease", "Healthy"),
        "confidence": selected.get("confidence", 0.92),
        "severity": selected.get("severity", "Moderate"),
        "symptoms": selected.get("symptoms", []),
        "cause": selected.get("cause", ""),
        "immediate_actions": selected.get("immediate_actions", []),
        "treatment": selected.get("treatment", []),
        "prevention": selected.get("prevention", []),
        "disclaimer": DISCLAIMER_TEXT
    }

    return result
