export async function GET() {
  return new Response(
    JSON.stringify({ message: "dashboard properties placeholder" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
