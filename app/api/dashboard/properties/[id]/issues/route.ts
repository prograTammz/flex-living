export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return new Response(
    JSON.stringify({ message: "property issues placeholder", id }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
