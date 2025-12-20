from django.core.signing import TimestampSigner, BadSignature, SignatureExpired

signer = TimestampSigner()


def generate_device_verification_token(device):
    """
    Create a signed, time-bound token for a login device
    """
    return signer.sign(device.fingerprint)


def verify_device_verification_token(token, max_age=900):
    """
    Verify token and return fingerprint
    - max_age default: 15 minutes
    """
    try:
        fingerprint = signer.unsign(token, max_age=max_age)
        return fingerprint
    except SignatureExpired:
        return None
    except BadSignature:
        return None
