```typescript
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return new Response(JSON.stringify({ message: "hostaway ingest placeholder", received: body }), {
    headers: { "Content-Type": "application/json" },
  });
}
```;
