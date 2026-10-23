import { parsePhoneNumberFromString } from "libphonenumber-js/max";

/*
 * A valid number that is a mobile, or one whose country's numbering plan
 * does not let libphonenumber tell mobile from landline with certainty.
 * The ambiguous case is allowed rather than rejecting valid numbers.
 *
 * Its own module so the full ("max") metadata, which is needed to tell a
 * mobile from a landline, is only downloaded when a form is submitted; see
 * checkMobileNumber in campaignTracking.js.
 */
export function isMobileNumber(phone) {
  const parsed = parsePhoneNumberFromString(phone || "");

  if (!parsed || !parsed.isValid()) {
    return false;
  }

  const numberType = parsed.getType();

  return numberType === "MOBILE" || numberType === "FIXED_LINE_OR_MOBILE";
}
