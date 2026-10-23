/*
 * Whether `phone` is a usable mobile number (see src/lib/phone-check.js).
 * Async on purpose: the phone metadata is not in the first load. PhoneField
 * preloads it as the field comes into view, so this is normally instant.
 */
export async function checkMobileNumber(phone) {
  try {
    const { isMobileNumber } = await import("@/lib/phone-check");
    return isMobileNumber(phone);
  } catch {
    // The metadata failed to download. Fall back to the basic
    // international shape rather than leaving Continue doing nothing.
    return /^\+[1-9]\d{7,14}$/.test(String(phone || "").replace(/[\s-]/g, ""));
  }
}
