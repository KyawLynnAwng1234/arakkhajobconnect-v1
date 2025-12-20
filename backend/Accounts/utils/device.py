import hashlib
from user_agents import parse

#get_client_ip, parse_user_agent, generate_fingerprint
def get_client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def parse_user_agent(request):
    ua_string = request.META.get("HTTP_USER_AGENT", "") or ""
    ua = parse(ua_string)

    device = ua.device.family or "Unknown device"
    os = (f"{ua.os.family} {ua.os.version_string}").strip() or "Unknown OS"
    browser = (f"{ua.browser.family} {ua.browser.version_string}").strip() or "Unknown browser"

    return {
        "device": device,
        "os": os,
        "browser": browser,
        "raw": ua_string,
        "is_bot": ua.is_bot,
    }


def generate_fingerprint(ua_string, ip=None):
    """
    Local friendly:
    - If localhost IP, ignore IP so you can simulate devices via UA changes
    Production:
    - You can include IP (optional) for stronger signal
    """
    base = ua_string or ""
    if ip and ip not in ("127.0.0.1", "::1"):
        base = base + "|" + ip
    return hashlib.sha256(base.encode("utf-8")).hexdigest()
