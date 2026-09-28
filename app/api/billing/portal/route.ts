import { getAuthenticatedAppUser } from "@/lib/auth";
import { getAppUrl, getDodoClient } from "@/lib/dodo";

export const runtime = "nodejs";

export async function POST() {
  const user = await getAuthenticatedAppUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.dodoCustomerId) {
    return Response.json(
      { error: "No billing account is connected yet." },
      { status: 409 },
    );
  }

  try {
    const session = await getDodoClient().customers.customerPortal.create(
      user.dodoCustomerId,
      { return_url: `${getAppUrl()}/billing` },
    );

    return Response.json({ url: session.link });
  } catch {
    return Response.json(
      { error: "The billing portal is temporarily unavailable." },
      { status: 503 },
    );
  }
}
