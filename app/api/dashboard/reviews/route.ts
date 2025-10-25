export async function GET() {
  return new Response(
    JSON.stringify({ message: "dashboard reviews placeholder" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
