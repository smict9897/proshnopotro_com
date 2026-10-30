export const sslHost = () => (process.env.SSLCZ_LIVE === "true" ? "https://securepay.sslcommerz.com" : "https://sandbox.sslcommerz.com");
export async function validate(valId: string) {
  const q = new URLSearchParams({ val_id: valId, store_id: process.env.SSLCZ_STORE_ID!, store_passwd: process.env.SSLCZ_STORE_PASS!, format: "json" });
  const r = await fetch(`${sslHost()}/validator/api/validationserverAPI.php?${q}`);
  return r.ok ? ((await r.json()) as { status: string; tran_id: string; amount: string; currency: string }) : null;
}
