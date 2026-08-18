from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
try:
    from database.models import Resource, Booking
except ImportError:
    from ..database.models import Resource, Booking

# Seed default demo agricultural resources if empty
DEFAULT_RESOURCES = [
    {
        "resource_type": "Tractor",
        "title": "Mahindra 575 DI (45 HP) with Rotavator & Cultivator",
        "provider_name": "Kisan Seva Machinery Rental",
        "location": "Warangal Rural, Telangana",
        "price": 750.0,
        "price_unit": "per hour",
        "availability": "Available",
        "contact_phone": "+91 98480 12345",
        "rating": 4.9,
        "description": "Heavy-duty 45 HP tractor equipped with 42-blade rotavator, reversible disc plough, and 9-tyne cultivator for rapid soil preparation.",
        "image_url": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80"
    },
    {
        "resource_type": "Tractor",
        "title": "John Deere 5050 D (50 HP) with Leveler",
        "provider_name": "Sri Lakshmi Agro Rentals",
        "location": "Karimnagar, Telangana",
        "price": 850.0,
        "price_unit": "per hour",
        "availability": "Available",
        "contact_phone": "+91 98490 23456",
        "rating": 4.8,
        "description": "50 HP high-torque engine with laser land leveler attachment for precision water saving.",
        "image_url": "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=800&auto=format&fit=crop&q=80"
    },
    {
        "resource_type": "Drone Spraying",
        "title": "Agri-Drone 16L Precision Crop Spraying Service",
        "provider_name": "Garuda Kisan Drone Services",
        "location": "Warangal / Hanamkonda",
        "price": 450.0,
        "price_unit": "per acre",
        "availability": "Available",
        "contact_phone": "+91 94401 34567",
        "rating": 4.95,
        "description": "DGCA certified drone pilot with 16-liter automated spray tank, obstacle avoidance radar, and micron droplet nozzles for uniform crop coverage.",
        "image_url": "https://images.unsplash.com/photo-1506947411487-a56738267384?w=800&auto=format&fit=crop&q=80"
    },
    {
        "resource_type": "Harvester",
        "title": "Kubota DC-68G Multi-Crop Combine Harvester",
        "provider_name": "Balaji Harvester Hub",
        "location": "Nalgonda / Miryalaguda",
        "price": 2200.0,
        "price_unit": "per hour",
        "availability": "Available",
        "contact_phone": "+91 98481 45678",
        "rating": 4.7,
        "description": "Rubber crawler track combine harvester suitable for wet paddy and maize harvesting with minimal grain loss (<1%).",
        "image_url": "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop&q=80"
    },
    {
        "resource_type": "JCB",
        "title": "JCB 3DX Super Eco Earthmover & Trencher",
        "provider_name": "Reddy Earthworks & Farm Infra",
        "location": "Warangal & Jangaon",
        "price": 1100.0,
        "price_unit": "per hour",
        "availability": "Available",
        "contact_phone": "+91 99890 56789",
        "rating": 4.85,
        "description": "Ideal for farm pond excavation, bund construction, field leveling, drainage canal digging, and clearing deep roots.",
        "image_url": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80"
    },
    {
        "resource_type": "Agricultural Equipment",
        "title": "Multi-Crop Automatic Thresher & Winnowing Unit",
        "provider_name": "Rythu Mitra Cooperative",
        "location": "Khammam, Telangana",
        "price": 600.0,
        "price_unit": "per hour",
        "availability": "Available",
        "contact_phone": "+91 94901 67890",
        "rating": 4.65,
        "description": "High output mobile thresher for paddy, maize, pulses, and wheat with built-in blower for clean grain separation.",
        "image_url": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80"
    }
]

def seed_resources_if_empty(db: Session):
    """
    Ensures default agricultural resources exist in database.
    """
    count = db.query(Resource).count()
    if count == 0:
        for item in DEFAULT_RESOURCES:
            res = Resource(**item)
            db.add(res)
        db.commit()

def get_resources_list(
    db: Session,
    resource_type: Optional[str] = None,
    location: Optional[str] = None
) -> List[Resource]:
    seed_resources_if_empty(db)
    query = db.query(Resource)
    if resource_type and resource_type.lower() != "all":
        query = query.filter(Resource.resource_type.ilike(f"%{resource_type}%"))
    if location:
        query = query.filter(Resource.location.ilike(f"%{location}%"))
    return query.all()

def check_resource_availability(
    db: Session,
    resource_id: int,
    booking_date: str
) -> Dict[str, Any]:
    seed_resources_if_empty(db)
    resource = db.query(Resource).filter(Resource.id == resource_id).first()
    if not resource:
        return {"available": False, "message": "Resource not found"}

    # Check existing bookings for that date
    existing = db.query(Booking).filter(
        Booking.resource_id == resource_id,
        Booking.booking_date == booking_date,
        Booking.status == "Confirmed"
    ).all()

    booked_slots = [b.booking_time for b in existing]
    all_slots = ["06:00 AM - 10:00 AM", "10:00 AM - 02:00 PM", "02:00 PM - 06:00 PM", "Full Day (06:00 AM - 06:00 PM)"]
    available_slots = [s for s in all_slots if s not in booked_slots]

    return {
        "resource_id": resource.id,
        "title": resource.title,
        "provider": resource.provider_name,
        "date": booking_date,
        "available": len(available_slots) > 0,
        "available_slots": available_slots,
        "booked_slots": booked_slots,
        "price": resource.price,
        "price_unit": resource.price_unit,
        "contact_phone": resource.contact_phone
    }

def create_booking(
    db: Session,
    farmer_id: Optional[int],
    farmer_name: str,
    farmer_phone: str,
    resource_id: int,
    booking_date: str,
    booking_time: str,
    location: str,
    notes: Optional[str] = None
) -> Booking:
    booking = Booking(
        farmer_id=farmer_id,
        farmer_name=farmer_name,
        farmer_phone=farmer_phone,
        resource_id=resource_id,
        booking_date=booking_date,
        booking_time=booking_time,
        location=location,
        status="Confirmed",
        notes=notes
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def get_farmer_bookings(db: Session, farmer_id: Optional[int] = None, phone: Optional[str] = None) -> List[Dict[str, Any]]:
    query = db.query(Booking, Resource).join(Resource, Booking.resource_id == Resource.id)
    if farmer_id:
        query = query.filter(Booking.farmer_id == farmer_id)

    raw_results = query.order_by(Booking.created_at.desc()).all()
    results = []

    clean_q_digits = "".join([c for c in phone if c.isdigit()]) if phone else ""

    for booking, res in raw_results:
        if phone:
            stored_digits = "".join([c for c in (booking.farmer_phone or "") if c.isdigit()])
            if clean_q_digits and clean_q_digits[-10:] not in stored_digits:
                continue

        results.append({
            "id": booking.id,
            "resource_id": res.id,
            "resource_title": res.title,
            "resource_type": res.resource_type,
            "provider_name": res.provider_name,
            "contact_phone": res.contact_phone,
            "price": res.price,
            "price_unit": res.price_unit,
            "booking_date": booking.booking_date,
            "booking_time": booking.booking_time,
            "location": booking.location,
            "status": booking.status,
            "created_at": booking.created_at.strftime("%d %b %Y, %I:%M %p") if booking.created_at else "Recently"
        })
    return results
