export async function GET() {
  return new Response(JSON.stringify({ message: "reviews list placeholder" }), {
    headers: { "Content-Type": "application/json" },
  });
}
