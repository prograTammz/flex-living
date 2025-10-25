export async function GET() {
  return new Response(
    JSON.stringify({ message: "hostaway reviews placeholder" }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
