import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export function generateMetadata() {
  return legalMetadata("privacy", "/privacy");
}

export default function PrivacyPage() {
  return <LegalPage slug="privacy" />;
}
