import LegalPage, { legalMetadata } from "@/components/Legal/LegalPage";

export function generateMetadata() {
  return legalMetadata("terms", "/terms");
}

export default function TermsPage() {
  return <LegalPage slug="terms" />;
}
