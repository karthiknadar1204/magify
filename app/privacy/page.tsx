import { LegalPage } from "@/components/legal-page";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Plain-language policy"
      title="Privacy"
      updated="28 September 2026"
      sections={[
        {
          title: "What Magnify stores",
          paragraphs: [
            "We store your account details, the editing choices you make, and the original and resulting images needed to provide your private history. We also keep basic operational records required to diagnose failures and protect the service.",
            "Your images are associated with your signed-in account and are served through authenticated routes rather than public links.",
          ],
        },
        {
          title: "How images are processed",
          paragraphs: [
            "When you request an edit, your image and editing instructions are sent to our image-processing provider solely to create the requested result. Account authentication and media storage are handled by specialist infrastructure providers acting on our behalf.",
          ],
        },
        {
          title: "Payments",
          paragraphs: [
            "Paid subscriptions and the customer billing portal are provided by Dodo Payments. Dodo receives the account, billing, and payment information needed to complete your purchase and manage renewals. Magnify stores Dodo customer and subscription identifiers and the resulting subscription status, but does not store your full card number.",
          ],
        },
        {
          title: "Control and deletion",
          paragraphs: [
            "You can delete an edit from its result page. This removes it from your history and requests deletion of its stored original, preview, and result files. Limited backup or security records may remain temporarily where technically necessary.",
          ],
        },
        {
          title: "Changes to this policy",
          paragraphs: [
            "We may change infrastructure and retention rules as we improve reliability, and we will update this page when the treatment of your data materially changes.",
          ],
        },
      ]}
    />
  );
}
