import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Private beta"
      title="Terms of use"
      updated="28 September 2026"
      sections={[
        {
          title: "Using Magnify",
          paragraphs: [
            "You may use Magnify to edit images you own or are authorised to use. Do not upload illegal content, intimate imagery without consent, abusive material, or anything that infringes another person's privacy or intellectual-property rights.",
          ],
        },
        {
          title: "AI-generated results",
          paragraphs: [
            "Image generation can be unpredictable. Review every result before publishing or relying on it, especially where accuracy, identity, products, or historical detail matters. Magnify does not guarantee that a result will be error-free or suitable for a particular purpose.",
          ],
        },
        {
          title: "Availability",
          paragraphs: [
            "The beta is provided as available and may be changed, rate-limited, or temporarily suspended while we test it. There is currently no paid plan and no card is required.",
          ],
        },
        {
          title: "Your content",
          paragraphs: [
            "You retain your rights in the images you upload. You give us the limited permission required to store, transmit, and process them to provide the editing service and maintain its security.",
          ],
        },
      ]}
    />
  );
}
