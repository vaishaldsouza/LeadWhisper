import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const AnalyzeSchema = z.object({
    aboutText: z.string().min(10, "About section must be at least 10 characters long."),
    tone: z.enum(["Professional", "Casual", "Bold"]).default("Professional"),
    companyBio: z.string().optional(),
    safetyCheck: z.boolean().optional().default(false),
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = AnalyzeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured on the server." },
                { status: 500 }
            );
        }

        const { aboutText, tone, companyBio, safetyCheck } = result.data;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            },
        });

        const bioContext = companyBio
            ? `\nHere is information about MY company (the sender):\n"""\n${companyBio}\n"""\nUse this context subtly when introducing the value proposition in the outreach.`
            : "";

        const safetyContext = safetyCheck
            ? `\nCRITICAL OUTREACH SAFETY RULE: Ensure the email and messages strictly avoid any spam trigger words (e.g., "free", "guarantee", "urgent", "act now", "risk-free", "winner"). Keep it exceedingly natural and human looking to pass harsh spam filters.`
            : "";

        const prompt = `
      You are a Top 1% Sales SDR known for writing hyper-personalized, high-converting cold outreach.
      I will provide you with a prospect's LinkedIn 'About' section and a desired 'Tone' for the outreach.
      ${bioContext}
      ${safetyContext}
      
      Your task is to analyze the prospect and output a highly structured JSON response with EXACTLY the following keys:
      - "buyerPersona": A string that MUST be exactly one of: "Analytical", "Assertive", "Visionary", or "Amiable". Deduce their psychological profile from their 'About' section.
      - "intelligenceSignal": A 1-sentence explanation of why you chose that buyerPersona based on specific details from their profile.
      - "painPoints": An array of EXACTLY 2 strings, representing the core business or professional pain points this person likely faces. Make them specific and insightful.
      - "companyContext": A short paragraph (string) of enriched data using your internal knowledge about the likely company environment, industry trends, or relevant context for this persona.
      - "outreach": An object containing the following 4 channels:
          - "email": An object with "subject" (string) and "body" (string). ${safetyCheck ? "Ensure the subject is incredibly calm and avoids spam triggers (no exclamation marks or urgent text). " : ""}The email body should be EXACTLY 3 sentences. Sentence 1 is a highly personalized hook. Sentence 2 introduces a relevant value proposition related to their pain points. Sentence 3 is a low-friction call to action.
          - "linkedIn": An object with "inMail" (string). A short, punchy 2-sentence LinkedIn connection request / InMail message.
          - "twitter": An object with "dm" (string). A casual, extremely brief (under 280 chars) Twitter direct message.
          - "coldCall": An object with "hook" (string) and "objectionTips" (array of EXACTLY 2 strings). The hook is an opening line for a cold call. The objectionTips are two battlecard suggestions on how to handle common objections for this specific persona.

      Tone requested: ${tone}
      Adjust your writing style across all outreach channels to match this tone AND to subtly mirror the detected buyerPersona's preferred communication style.
      - Professional: polished, highly respectful, value-driven.
      - Casual: relaxed, conversational, friendly.
      - Bold: confident, provocative, challenging the status quo.

      Prospect's LinkedIn About Section:
      """
      ${aboutText}
      """
      
      Return ONLY valid JSON with no markdown wrapping and identical keys.
    `;

        const aiResult = await model.generateContent(prompt);
        const responseText = aiResult.response.text();

        // Parse the JSON response
        const parsedData = JSON.parse(responseText);

        const triggerWords = ["free", "guarantee", "urgent", "act now", "risk-free", "winner", "limited time", "buy", "discount", "cash", "bonus", "click here", "deal"];
        let spamScore = 100;
        if (parsedData.outreach && parsedData.outreach.email) {
            const lowerEmail = (parsedData.outreach.email.subject + " " + parsedData.outreach.email.body).toLowerCase();
            triggerWords.forEach(word => {
                if (lowerEmail.includes(word)) {
                    spamScore -= 20;
                }
            });
        }
        parsedData.spamScore = Math.max(0, spamScore);

        return NextResponse.json(parsedData);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to generate analysis. Please try again later." },
            { status: 500 }
        );
    }
}
