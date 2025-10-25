export async function GET() {
  return new Response(
    JSON.stringify({ message: "dashboard report placeholder" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
