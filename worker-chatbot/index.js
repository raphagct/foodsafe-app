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
      const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620", // updated to a valid claude model name
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [
            ...history.slice(-10),   // keep last 10 turns for context
            { role: "user", content: question }
          ]
        })
      });

      const data  = await apiRes.json();
      const answer = data.content?.[0]?.text ?? "No response received.";

      return new Response(JSON.stringify({ answer }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
        status: 503,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  }
};
