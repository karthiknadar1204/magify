import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="The essentials"
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
          title: "Credits and subscriptions",
          paragraphs: [
            "New accounts may receive complimentary credits. Magnify Pro is a recurring monthly subscription processed by Dodo Payments. The price, renewal period, and included credits are shown before checkout. You can manage or cancel your subscription through the billing portal, and cancellation takes effect according to the date shown there.",
            "One credit is used only after a requested edit finishes successfully. A failed generation is automatically refunded. Monthly credits reset when a new paid billing period begins and do not roll over unless Magnify explicitly says otherwise.",
          ],
        },
        {
          title: "Availability",
          paragraphs: [
            "Magnify is provided as available and may be changed, rate-limited, or temporarily suspended for maintenance, security, or provider outages. We may change plan features or pricing prospectively, with the current terms displayed before purchase or renewal where required.",
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
