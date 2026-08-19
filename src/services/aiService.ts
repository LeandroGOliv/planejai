interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface GeminiContent {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface InsightData {
  title?: string
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (
  contents: GeminiContent[],
  systemInstruction?: string,
) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      ...(systemInstruction && {
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

const extractText = (response: GeminiResponse) => {
  return response.candidates[0].content.parts[0].text
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI([
    { role: 'user', parts: [{ text: prompt }] },
  ])

  return JSON.parse(extractText(response)) as InsightData
}

export const askQuestion = async (
  contents: GeminiContent[],
  systemInstruction: string,
) => {
  const response = await callGeminiAPI(contents, systemInstruction)

  return extractText(response).trim()
}
