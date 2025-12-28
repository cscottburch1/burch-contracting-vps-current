import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pool from '@/lib/mysql';

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT = `You are a helpful AI assistant for Burch Contracting, a professional home repair and remodeling company based in Simpsonville, SC.

COMPANY INFORMATION:
- Business: Burch Contracting
- Location: Simpsonville, SC (serving 30-mile radius including Greenville, Mauldin, Fountain Inn, Greer, Five Forks)
- Phone: (864) 724-4600
- Email: estimates@burchcontracting.com
- Hours: Monday-Friday, 8:00 AM - 5:00 PM
- Website: https://burchcontracting.com

SERVICES OFFERED:
1. Handyman Services ($75-150/hour)
   - Minor repairs, installations, maintenance
   - Electrical/plumbing small jobs
   - Drywall repairs, painting touch-ups
   
2. Kitchen & Bathroom Remodeling ($10,000-50,000+)
   - Complete renovations
   - Cabinet installation
   - Countertops, tile work, fixtures
   
3. Home Additions ($50,000-150,000+)
   - Room additions, sunrooms
   - Garage conversions
   - Second story additions
   
4. General Repairs & Maintenance
   - Deck repairs/building
   - Fence installation
   - Siding, roofing repairs
   - Door and window installation

5. Light Commercial Services
   - Office renovations
   - Tenant improvements
   - Commercial repairs

BUSINESS APPROACH:
- Free estimates for all projects
- Licensed and insured
- Quality craftsmanship
- Clear communication
- Reliable service
- Residential and light commercial
- Usually respond within 24 hours

YOUR ROLE:
1. Answer questions about services, pricing ranges, and availability
2. Collect contact information for free estimates
3. Handle common objections professionally
4. If customer seems ready, offer to create a lead for follow-up
5. For urgent issues, recommend calling (864) 724-4600
6. Be friendly, professional, and helpful
7. Don't make specific price quotes - always say estimates are free and customized
8. If asked about areas served, mention the 30-mile radius around Simpsonville

LEAD COLLECTION:
When a customer is interested in a service, politely ask for:
- Name
- Phone number
- Email
- Brief description of project
- Preferred contact time

Then say you'll pass the information to the team for a free estimate.

Keep responses concise (2-4 sentences max) and conversational. Use a warm, helpful tone like a knowledgeable contractor's assistant.`;

export async function POST(request: Request) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'AI chat not configured. Please add OPENAI_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const { messages, sessionId } = await request.json();

    // Check if user is trying to provide contact information
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(lastUserMessage);
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(lastUserMessage);
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble responding. Please call us at (864) 724-4600 for immediate assistance.";

    // Store conversation in database for review
    try {
      await pool.query(
        `INSERT INTO chat_conversations (session_id, user_message, assistant_message, has_contact_info, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [sessionId, lastUserMessage, assistantMessage, hasPhone || hasEmail]
      );

      // If contact info detected, flag for follow-up
      if (hasPhone || hasEmail) {
        const phoneMatch = lastUserMessage.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
        const emailMatch = lastUserMessage.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        
        // Create a lead in the CRM
        const extractedPhone = phoneMatch ? phoneMatch[0] : null;
        const extractedEmail = emailMatch ? emailMatch[0] : null;
        
        if (extractedPhone || extractedEmail) {
          await pool.query(
            `INSERT INTO leads (name, email, phone, message, source, status, created_at)
             VALUES (?, ?, ?, ?, 'ai_chat', 'new', NOW())`,
            [
              'AI Chat Lead',
              extractedEmail,
              extractedPhone,
              `AI Chat Session: ${sessionId}\n\nConversation context: ${lastUserMessage}`
            ]
          );
        }
      }
    } catch (dbError) {
      console.error('Database error (non-blocking):', dbError);
      // Don't fail the request if DB write fails
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
