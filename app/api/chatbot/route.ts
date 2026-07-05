import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { verifyAuth, unauthorized } from "@/backend/lib/auth";
import { rateLimit } from "@/backend/lib/rate-limit";

const SYSTEM_PROMPT = `You are MediCare Pro's AI Health Assistant — a friendly, knowledgeable, and empathetic virtual health advisor built into a clinic management system.

Your role:
- Answer general health questions clearly and in plain language.
- Help patients understand symptoms, conditions, medications, and healthy lifestyle choices.
- Provide general wellness advice (diet, exercise, sleep, mental health, preventive care).
- Explain medical terms in simple words.
- Remind patients to consult a real doctor for diagnosis, prescriptions, or emergencies.

Rules you must always follow:
1. Never diagnose a specific illness for the user.
2. Never recommend or prescribe specific medications or dosages.
3. For any urgent or emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise the user to call emergency services or visit the nearest ER.
4. Be compassionate and non-judgmental.
5. Keep responses concise, friendly, and easy to understand — avoid heavy medical jargon.
6. If a question is not health-related, politely redirect: "I'm here to help with health-related questions."

Always end your response with a gentle reminder when appropriate: "Remember, always consult your doctor for personalized medical advice."`;

export async function POST(req: Request) {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  if (!rateLimit(`chat:${user.userId}`, 15, 60_000)) { // cap each user at 15 messages per minute to control cost/abuse
    return NextResponse.json({ error: "You're sending messages too quickly. Please slow down." }, { status: 429 });
  }

  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured." }, { status: 500 });
    }

    const groq = new Groq({ apiKey });

    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (turn.role === "user") {
          messages.push({ role: "user", content: turn.text });
        } else if (turn.role === "model" || turn.role === "assistant") {
          messages.push({ role: "assistant", content: turn.text });
        }
      }
    }

    messages.push({ role: "user", content: message.trim() });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Chatbot route error:", err);

    const status = (err as { status?: number })?.status;
    if (status === 429) {
      return NextResponse.json(
        { error: "The AI assistant is temporarily unavailable due to usage limits. Please try again in a few minutes." },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
