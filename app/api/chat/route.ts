import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Create chat completion using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile', // Using latest best-in-class Llama 3.3 70B model
      temperature: 0.7,
      max_tokens: 1024,
      stream: false,
    });

    const responseMessage = chatCompletion.choices[0]?.message;

    if (!responseMessage) {
      throw new Error('No response from Groq API');
    }

    return NextResponse.json({
      message: responseMessage,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 