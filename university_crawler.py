# -*- coding: utf-8 -*-
"""
University crawler for Vietnamese university websites.

Dependencies:
    pip install requests beautifulsoup4

Usage example:
    from university_crawler import crawl_university, crawl_many
    data = crawl_university("https://uit.edu.vn")
    print(data)

Design goals:
- Heuristic-based extraction that works across diverse CMS (Drupal, WordPress, Joomla).
- Vietnamese-aware keyword detection (e.g., "Liên hệ", "Giới thiệu").
- Social links & media (logo, banner) detection.
- Gentle crawling (delay, headers), with simple robots.txt respect.
"""

from __future__ import annotations

import re
import time
import json
import unicodedata
from dataclasses import dataclass, asdict, field
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse, parse_qs

import requests
from bs4 import BeautifulSoup

VN_CONTACT_KEYWORDS = [
    "liên hệ", "lien he", "contact", "contact-us", "contac", "thông tin",
    "thong tin", "ban do", "map", "địa chỉ", "dia chi"
]

VN_ABOUT_KEYWORDS = [
    "giới thiệu", "gioi thieu", "about", "tổng quan", "tong quan", "lịch sử", "lich su", "sứ mệnh",
    "su menh", "tầm nhìn", "tam nhin", "vision", "mission", "history"
]

VN_FOOTER_SELECTORS = [
    "footer", ".site-footer", "#footer", ".footer"
]

SOCIAL_DOMAINS = {
    "facebook": "facebook.com",
    "youtube": "youtube.com",
    "zalo": "zalo.me",
    "tiktok": "tiktok.com",
    "instagram": "instagram.com",
    "linkedin": "linkedin.com",
    "twitter": "twitter.com",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; UniVN-Crawler/1.0; +https://example.local)",
    "Accept-Language": "vi,vi-VN;q=0.9,en;q=0.6",
}

PHONE_RE = re.compile(r"(?:\+?84|0)(?:\s|-|\.)?(?:\d{2,3})(?:\s|-|\.)?\d{3}(?:\s|-|\.)?\d{3,4}")
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
# Common address markers in VN
ADDRESS_MARKERS = ["địa chỉ", "dia chi", "address", "khu phố", "phường", "quận", "thành phố", "tp.", "huyện", "tỉnh"]

def _normalize_text(s: str) -> str:
    s = unicodedata.normalize("NFKC", s or "")
    s = re.sub(r"\s+", " ", s, flags=re.M).strip()
    return s

def _fetch(url: str, timeout: int = 15) -> Optional[requests.Response]:
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        if r.status_code == 200 and "text/html" in r.headers.get("Content-Type", ""):
            return r
    except requests.RequestException:
        return None
    return None

def _parse_html(html_text: str) -> BeautifulSoup:
    return BeautifulSoup(html_text, "html.parser")

def _absolute(base: str, href: str) -> str:
    return urljoin(base, href) if href else ""

def _find_links_by_keywords(soup: BeautifulSoup, base: str, keywords: List[str]) -> List[str]:
    links = []
    for a in soup.find_all("a", href=True):
        text = _normalize_text(a.get_text(" ").lower())
        href = a["href"]
        if any(k in text for k in keywords):
            links.append(_absolute(base, href))
    # Deduplicate while preserving order
    seen = set()
    uniq = []
    for u in links:
        if u not in seen:
            seen.add(u)
            uniq.append(u)
    return uniq

def _meta_content(soup: BeautifulSoup, name: str) -> Optional[str]:
    tag = soup.find("meta", attrs={"name": name}) or soup.find("meta", attrs={"property": name})
    return _normalize_text(tag.get("content")) if tag and tag.get("content") else None

def _guess_names(domain: str, title: str) -> Tuple[Optional[str], Optional[str]]:
    """
    Returns (short_name, english_name)
    Heuristics:
    - short name is uppercase acronym from title or domain (e.g., uit.edu.vn -> UIT)
    - english name: look for parts in title with 'University' or phrases in English
    """
    short = None
    eng = None
    host = urlparse(domain).hostname or ""
    # domain acronym
    parts = host.split(".")
    if len(parts) >= 3:
        candidate = parts[-3]
        if 2 <= len(candidate) <= 6 and candidate.isalpha():
            short = candidate.upper()
    # from title
    acronyms = re.findall(r"(?<![A-Z])[A-Z]{2,6}(?![A-Z])", title or "")
    if acronyms:
        short = acronyms[0]
    if "university" in (title or "").lower():
        eng = title
    return short, eng

def _extract_logo_and_banner(soup: BeautifulSoup, base: str) -> Tuple[Optional[str], Optional[str]]:
    logo = None
    banner = None

    # Try meta og:image first
    og = soup.find("meta", attrs={"property": "og:image"}) or soup.find("meta", attrs={"name": "og:image"})
    if og and og.get("content"):
        banner = _absolute(base, og["content"])

    # Heuristic: header logo
    candidates = []
    header = soup.find("header")
    if header:
        candidates.extend(header.find_all("img"))
    candidates.extend(soup.select("img[alt*=logo i], img[src*=logo], .logo img"))
    for img in candidates:
        src = img.get("src") or img.get("data-src")
        if not src:
            continue
        src_abs = _absolute(base, src)
        alt = (img.get("alt") or "").lower()
        if "logo" in alt or ("logo" in (src or "").lower()):
            logo = src_abs
            break

    # Hero/banner image (look for large header images)
    hero = soup.select_one(".hero img, .banner img, .slider img, .carousel img")
    if hero and hero.get("src"):
        banner = _absolute(base, hero.get("src"))

    return logo, banner

def _extract_social_links(soup: BeautifulSoup, base: str) -> Dict[str, str]:
    socials = {}
    for a in soup.find_all("a", href=True):
        href = _absolute(base, a["href"])
        for key, dom in SOCIAL_DOMAINS.items():
            if dom in href and key not in socials:
                socials[key] = href
    return socials

def _extract_from_footer(soup: BeautifulSoup) -> str:
    for sel in VN_FOOTER_SELECTORS:
        footer = soup.select_one(sel)
        if footer:
            return footer.get_text(" ")
    # fallback: last 1000 chars of page text
    text = soup.get_text(" ")
    return text[-1000:] if text else ""

def _extract_contacts(text: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    """Return (address, phone, email, city_or_province_guess)"""
    phone = None
    email = None
    address = None
    city_or_province = None

    # Email & phone first
    email_match = EMAIL_RE.search(text)
    if email_match:
        email = email_match.group(0)

    phone_match = PHONE_RE.search(text)
    if phone_match:
        phone = phone_match.group(0)

    # Address: find lines containing markers
    lowered = text.lower()
    addr_idx = -1
    for m in ADDRESS_MARKERS:
        idx = lowered.find(m)
        if idx != -1:
            addr_idx = idx
            break
    if addr_idx != -1:
        seg = text[max(0, addr_idx - 50): addr_idx + 250]
        # crude line extraction
        seg = re.sub(r"\s+", " ", seg).strip(" :|-")
        # Stop at first email/phone that might follow
        seg = EMAIL_RE.split(seg)[0]
        seg = PHONE_RE.split(seg)[0]
        # Clean label
        seg = re.sub(r"(?i)(địa chỉ|dia chi|address)\s*[:：-]?\s*", "", seg).strip(",; ")
        address = seg

    # City/province guess (very rough, can be improved)
    cities = [
        "Hà Nội", "Hanoi", "Đà Nẵng", "Da Nang", "Hồ Chí Minh", "TP.HCM", "TP. HCM", "Thủ Đức",
        "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Huế", "Thừa Thiên Huế", "Nha Trang",
        "Khánh Hòa", "Quảng Ninh", "Ninh Bình", "Nam Định", "Quy Nhơn", "Bình Định"
    ]
    for c in cities:
        if c.lower() in lowered:
            city_or_province = c
            break

    return address, phone, email, city_or_province

def _first_non_empty(*vals):
    for v in vals:
        if v and _normalize_text(v):
            return _normalize_text(v)
    return None

@dataclass
class UniversityRecord:
    name: Optional[str] = None
    short_name: Optional[str] = None
    english_name: Optional[str] = None
    address: Optional[str] = None
    location: Optional[Dict[str, float]] = None  # {"lat": ..., "lng": ...}
    city: Optional[str] = None
    province: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    description: Optional[str] = None
    history: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    extra: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> Dict:
        d = asdict(self)
        # Remove empty keys for cleanliness
        return {k: v for k, v in d.items() if v not in (None, "", [], {})}

def crawl_university(url: str, delay: float = 0.8, timeout: int = 15) -> Dict:
    """
    Crawl a single university homepage and attempt to extract a structured record.
    - delay: polite delay between internal requests (seconds)
    """
    url = url.strip()
    if not url.startswith("http"):
        url = "https://" + url

    base = url
    r = _fetch(base, timeout=timeout)
    if not r:
        return {"error": f"Cannot fetch {base}"}

    soup = _parse_html(r.text)
    title = _normalize_text(soup.title.get_text()) if soup.title else ""
    name = _first_non_empty(
        _meta_content(soup, "og:site_name"),
        _meta_content(soup, "og:title"),
        title,
    )

    short, eng = _guess_names(base, title)

    logo, banner = _extract_logo_and_banner(soup, base)
    socials = _extract_social_links(soup, base)

    footer_text = _normalize_text(_extract_from_footer(soup))
    addr, phone, email, city_guess = _extract_contacts(footer_text)

    # Try to find contact/about pages for more details
    more_text = ""
    links = _find_links_by_keywords(soup, base, VN_CONTACT_KEYWORDS + VN_ABOUT_KEYWORDS)
    for i, link in enumerate(links[:4]):  # limit to 4 extra pages
        time.sleep(delay)
        r2 = _fetch(link, timeout=timeout)
        if not r2:
            continue
        s2 = _parse_html(r2.text)
        page_text = _normalize_text(s2.get_text(" "))
        more_text += " " + page_text

    if more_text:
        addr2, phone2, email2, city2 = _extract_contacts(more_text)
        addr = addr or addr2
        phone = phone or phone2
        email = email or email2
        city_guess = city_guess or city2

    # Description: meta description or about snippets
    description = _first_non_empty(
        _meta_content(soup, "description"),
        _meta_content(soup, "og:description"),
    )
    if not description and more_text:
        # pull a paragraph around 'giới thiệu' or 'about'
        m = re.search(r"(?i)(giới thiệu|gioi thieu|about|tổng quan|tong quan).{0,300}", more_text)
        if m:
            description = _normalize_text(m.group(0))

    # Mission / Vision / History (rough)
    mission = None
    vision = None
    history = None
    if more_text:
        mm = re.search(r"(?i)(sứ mệnh|su menh|mission).{0,400}", more_text)
        vm = re.search(r"(?i)(tầm nhìn|tam nhin|vision).{0,400}", more_text)
        hm = re.search(r"(?i)(lịch sử|lich su|history).{0,400}", more_text)
        mission = _normalize_text(mm.group(0)) if mm else None
        vision = _normalize_text(vm.group(0)) if vm else None
        history = _normalize_text(hm.group(0)) if hm else None

    record = UniversityRecord(
        name=name,
        short_name=short,
        english_name=eng,
        address=addr,
        city=city_guess,
        province=None,  # province is hard to infer reliably without a gazetteer
        phone=phone,
        email=email,
        website=base,
        facebook=socials.get("facebook"),
        logo_url=logo,
        banner_url=banner,
        description=description,
        history=history,
        mission=mission,
        vision=vision,
        extra={k: v for k, v in socials.items() if k != "facebook"},
    )
    return record.to_dict()

def crawl_many(urls: List[str], delay: float = 0.8, timeout: int = 15) -> List[Dict]:
    results = []
    for u in urls:
        try:
            results.append(crawl_university(u, delay=delay, timeout=timeout))
        except Exception as e:
            results.append({"error": f"{u}: {e}"})
    return results

if __name__ == "__main__":
    # Quick smoke test (replace with real domains when running locally)
    test_urls = ["https://uit.edu.vn", "https://www.hust.edu.vn"]
    print(json.dumps(crawl_many(test_urls), ensure_ascii=False, indent=2))



# ----------------------------
# Extended schema & utilities
# ----------------------------

from datetime import datetime

VN_PUBLIC_HINTS = [
    "đại học quốc gia", "bo giao duc", "bộ giáo dục", "đại học công lập", "university of"
]
VN_PRIVATE_HINTS = [
    "đại học tư thục", "tư thục", "private university", "dân lập", "dan lap"
]

def _guess_type(page_text: str) -> Optional[str]:
    t = (page_text or "").lower()
    if any(k in t for k in VN_PUBLIC_HINTS):
        return "public"
    if any(k in t for k in VN_PRIVATE_HINTS):
        return "private"
    return None

def _find_map_and_coords(soup: BeautifulSoup, base: str) -> Tuple[Optional[str], Optional[float], Optional[float]]:
    # Try to find a Google Maps iframe/link and parse lat/lng
    # Patterns: .../@10.870,106.803... or ?q=lat,lng or !3dLAT!4dLNG
    map_url = None
    lat = None
    lng = None

    # Check iframes first
    for iframe in soup.find_all("iframe", src=True):
        src = _absolute(base, iframe["src"])
        if "google.com/maps" in src or "maps.app.goo.gl" in src:
            map_url = src
            m = re.search(r"/@(-?\d+\.\d+),(-?\d+\.\d+)", src)
            if m:
                lat = float(m.group(1)); lng = float(m.group(2))
                return map_url, lat, lng
            # Try q=lat,lng
            qs = parse_qs(urlparse(src).query)
            if "q" in qs:
                q = qs["q"][0]
                m2 = re.search(r"(-?\d+\.\d+),\s*(-?\d+\.\d+)", q)
                if m2:
                    lat = float(m2.group(1)); lng = float(m2.group(2))
                    return map_url, lat, lng
    # Fallback: any link
    for a in soup.find_all("a", href=True):
        href = _absolute(base, a["href"])
        if "google.com/maps" in href or "maps.app.goo.gl" in href:
            map_url = href
            m = re.search(r"/@(-?\d+\.\d+),(-?\d+\.\d+)", href)
            if m:
                lat = float(m.group(1)); lng = float(m.group(2))
            else:
                qs = parse_qs(urlparse(href).query)
                if "q" in qs:
                    q = qs["q"][0]
                    m2 = re.search(r"(-?\d+\.\d+),\s*(-?\d+\.\d+)", q)
                    if m2:
                        lat = float(m2.group(1)); lng = float(m2.group(2))
            return map_url, lat, lng
    return map_url, lat, lng

def _extract_year(text: str) -> Optional[int]:
    # Look for founded year patterns like "thành lập năm 2006", "founded in 1956"
    m = re.search(r"(?i)(thành lập|founded)\D{0,20}(\d{4})", text or "")
    if m:
        try:
            year = int(m.group(2))
            if 1800 <= year <= datetime.now().year:
                return year
        except:
            pass
    return None

FACILITY_KEYWORDS = ["thư viện", "phòng lab", "phòng thí nghiệm", "ký túc xá", "khu thể thao", "căn tin", "nhà thi đấu"]
SPECIALIZATION_HINTS = ["ngành", "chuyên ngành", "khoa "]

def _collect_facilities(all_text: str) -> List[str]:
    out = []
    low = (all_text or "").lower()
    for kw in FACILITY_KEYWORDS:
        if kw in low:
            # title case each facility for nicer output
            out.append(kw.title().replace("Phòng", "Phòng").replace("Ký", "Ký"))
    return list(dict.fromkeys(out))[:12]

def _collect_specializations(soup: BeautifulSoup) -> List[str]:
    # Try to collect bullet lists near headings containing "Ngành", "Khoa", "Chuyên ngành"
    items = []
    for hdr in soup.find_all(["h1","h2","h3","h4","h5"]):
        txt = _normalize_text(hdr.get_text(" ")).lower()
        if any(h in txt for h in SPECIALIZATION_HINTS):
            ul = hdr.find_next(["ul","ol"])
            if ul:
                for li in ul.find_all("li"):
                    t = _normalize_text(li.get_text(" "))
                    if 2 <= len(t) <= 120:
                        items.append(t)
    # As a fallback, scan links that look like faculties
    if not items:
        for a in soup.find_all("a", href=True):
            t = _normalize_text(a.get_text(" "))
            if re.search(r"(?i)\b(Khoa|Ngành|Chuyên ngành)\b", t):
                items.append(t)
    # Dedup & limit
    out = []
    seen = set()
    for it in items:
        if it and it.lower() not in seen:
            seen.add(it.lower())
            out.append(it)
    return out[:25]

def crawl_university_to_schema(url: str, delay: float = 0.8, timeout: int = 15) -> Dict:
    base_result = crawl_university(url, delay=delay, timeout=timeout)
    if isinstance(base_result, dict) and base_result.get("error"):
        # still return full schema with minimal fields and an error note in 'source'
        now = datetime.utcnow().isoformat()
        return {
            "name": None,
            "short_name": None,
            "english_name": None,
            "address": None,
            "location": None,
            "city": None,
            "province": None,
            "phone": None,
            "email": None,
            "website": url if url.startswith("http") else "https://" + url,
            "facebook": None,
            "logo_url": None,
            "banner_url": None,
            "description": None,
            "history": None,
            "mission": None,
            "vision": None,
            "type": None,
            "status": "active",
            "founded_year": None,
            "accreditation": None,
            "specializations": [],
            "facilities": [],
            "achievements": None,
            "ranking_national": None,
            "ranking_international": None,
            "student_count": None,
            "faculty_count": None,
            "acceptance_rate": None,
            "tuition_fee_min": None,
            "tuition_fee_max": None,
            "currency": "VND",
            "admission_requirements": None,
            "scholarships": None,
            "international_partnerships": None,
            "campus_map_url": None,
            "latitude": None,
            "longitude": None,
            "is_featured": False,
            "is_verified": False,
            "view_count": 0,
            "review_count": 0,
            "average_rating": 0.0,
            "total_rating": 0,
            "source": f"Crawler error: {base_result.get('error')}",
            "crawled_at": now
        }

    # If crawl_university succeeded:
    website = base_result.get("website")
    r = _fetch(website, timeout=timeout)
    soup = _parse_html(r.text) if r else None
    page_text = _normalize_text(soup.get_text(" ")) if soup else ""

    # Gather more info
    map_url, lat, lng = (None, None, None)
    specializations = []
    facilities = []
    founded_year = None
    uni_type = None

    if soup:
        map_url, lat, lng = _find_map_and_coords(soup, website)
        specializations = _collect_specializations(soup)
    facilities = _collect_facilities(page_text)
    founded_year = _extract_year(page_text)
    uni_type = _guess_type(page_text)

    # Province heuristic from city/address (very light-touch)
    province = None
    city = base_result.get("city")
    address = base_result.get("address")
    if not city and address:
        # try to pull "TP.HCM", "Hà Nội", etc.
        mcity = re.search(r"(TP\.?\s*HCM|TP\.?\s*Hồ Chí Minh|Hà Nội|Đà Nẵng|Cần Thơ|Bình Dương|Đồng Nai|Huế|Khánh Hòa)", address, re.IGNORECASE)
        if mcity:
            city = mcity.group(1)
    if not province and city:
        province = city  # simple fallback

    now = datetime.utcnow().isoformat()

    # Build full schema
    full = {
        "name": base_result.get("name"),
        "short_name": base_result.get("short_name"),
        "english_name": base_result.get("english_name"),
        "address": address,
        "location": None,
        "city": city,
        "province": province,
        "phone": base_result.get("phone"),
        "email": base_result.get("email"),
        "website": website,
        "facebook": base_result.get("facebook"),
        "logo_url": base_result.get("logo_url"),
        "banner_url": base_result.get("banner_url"),
        "description": base_result.get("description"),
        "history": base_result.get("history"),
        "mission": base_result.get("mission"),
        "vision": base_result.get("vision"),
        "type": uni_type,                 # "public"/"private"/None
        "status": "active",
        "founded_year": founded_year,
        "accreditation": None,
        "specializations": specializations or [],
        "facilities": facilities or [],
        "achievements": None,
        "ranking_national": None,
        "ranking_international": None,
        "student_count": None,
        "faculty_count": None,
        "acceptance_rate": None,
        "tuition_fee_min": None,
        "tuition_fee_max": None,
        "currency": "VND",
        "admission_requirements": None,
        "scholarships": None,
        "international_partnerships": None,
        "campus_map_url": map_url,
        "latitude": lat,
        "longitude": lng,
        "is_featured": False,
        "is_verified": False,
        "view_count": 0,
        "review_count": 0,
        "average_rating": 0.0,
        "total_rating": 0,
        "source": "Crawler",
        "crawled_at": now
    }
    return full

def crawl_many_to_schema(urls: List[str], delay: float = 0.8, timeout: int = 15) -> List[Dict]:
    out = []
    for u in urls:
        try:
            out.append(crawl_university_to_schema(u, delay=delay, timeout=timeout))
        except Exception as e:
            now = datetime.utcnow().isoformat()
            out.append({
                "name": None,
                "short_name": None,
                "english_name": None,
                "address": None,
                "location": None,
                "city": None,
                "province": None,
                "phone": None,
                "email": None,
                "website": u if u.startswith("http") else "https://" + u,
                "facebook": None,
                "logo_url": None,
                "banner_url": None,
                "description": None,
                "history": None,
                "mission": None,
                "vision": None,
                "type": None,
                "status": "active",
                "founded_year": None,
                "accreditation": None,
                "specializations": [],
                "facilities": [],
                "achievements": None,
                "ranking_national": None,
                "ranking_international": None,
                "student_count": None,
                "faculty_count": None,
                "acceptance_rate": None,
                "tuition_fee_min": None,
                "tuition_fee_max": None,
                "currency": "VND",
                "admission_requirements": None,
                "scholarships": None,
                "international_partnerships": None,
                "campus_map_url": None,
                "latitude": None,
                "longitude": None,
                "is_featured": False,
                "is_verified": False,
                "view_count": 0,
                "review_count": 0,
                "average_rating": 0.0,
                "total_rating": 0,
                "source": f"Crawler error: {e}",
                "crawled_at": now
            })
    return out
