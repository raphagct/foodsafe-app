export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const { question, history = [] } = await request.json();
    if (!question?.trim()) {
      return new Response(JSON.stringify({ error: "Question is required" }), { status: 400 });
    }

    const SYSTEM_PROMPT = `You are a Food Safety Specialist AI. You have deep expertise in:
- FDA, USDA, EPA food safety regulations
- Foodborne pathogen biology (Salmonella, Listeria, E. coli O157:H7, Norovirus, Campylobacter)
- HACCP, ISO 22000, SQF food safety management systems
- Food labeling law (21 CFR 101, FALCPA, FASTER Act)
- Cold chain and temperature management
- Pesticide tolerances and residue assessment

Rules:
1. Be concise and accurate. Cite regulations or studies where relevant.
2. For active foodborne illness emergencies: recommend calling 911 or Poison Control (1-800-222-1222) IMMEDIATELY.
3. For recall information: direct users to foodsafety.gov.
4. Never provide personal medical diagnoses. Recommend healthcare providers when appropriate.
5. Acknowledge uncertainty clearly rather than guessing.`;

    try {
      // Using Cloudflare's built-in free AI (Meta Llama 3.1)
      const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...history.slice(-10),   // keep last 10 turns for context
          { role: "user", content: question }
        ]
      });

      const answer = response?.response;

      if (!answer) {
        return new Response(JSON.stringify({ error: "Empty response from AI." }), {
          status: 502,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      return new Response(JSON.stringify({ answer }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      console.error("Worker fetch error:", err);
      return new Response(JSON.stringify({ error: err?.message || "Service temporarily unavailable." }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
