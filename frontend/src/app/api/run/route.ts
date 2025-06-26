// app/api/run/route.ts
export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    const response = await fetch('http://localhost:5000/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error contacting backend API' }),
      { status: 500 }
    );
  }
}
