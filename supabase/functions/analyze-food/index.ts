const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, prefer, x-supabase-auth",
}

interface FoodItem {
  item: string;
  calories: string;
  protein: string;
  fat: string;
  vitamin_e: string;
  carbohydrates: string;
  fiber: string;
  iron: string;
}

interface AnalysisResponse {
  food_items: FoodItem[];
}

function extractJsonFromResponse(text: string): string {
  if (!text) {
    throw new Error("Empty response text")
  }

  // First, try to find a complete JSON object by locating the first '{' and last '}'
  const firstBrace = text.indexOf('{')
  const lastBrace = text.lastIndexOf('}')
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const jsonCandidate = text.substring(firstBrace, lastBrace + 1)
    
    // Test if this is valid JSON
    try {
      JSON.parse(jsonCandidate)
      return jsonCandidate
    } catch {
      // If that fails, continue to other methods
    }
  }

  // Fallback: Remove markdown code block fences and other common formatting
  let cleanedText = text
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .replace(/^\s*[\r\n]/gm, '') // Remove empty lines
    .trim()

  // Try to extract JSON from the cleaned text
  const cleanedFirstBrace = cleanedText.indexOf('{')
  const cleanedLastBrace = cleanedText.lastIndexOf('}')
  
  if (cleanedFirstBrace !== -1 && cleanedLastBrace !== -1 && cleanedLastBrace > cleanedFirstBrace) {
    const finalCandidate = cleanedText.substring(cleanedFirstBrace, cleanedLastBrace + 1)
    
    // Test if this is valid JSON
    try {
      JSON.parse(finalCandidate)
      return finalCandidate
    } catch {
      // If still fails, throw error with more context
      throw new Error(`Could not extract valid JSON. Original text: ${text.substring(0, 200)}...`)
    }
  }

  throw new Error(`No valid JSON structure found in response: ${text.substring(0, 200)}...`)
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  
  // Use iterative approach to avoid call stack overflow
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  
  return btoa(binary)
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    if (req.method !== "POST") {
      throw new Error("Method not allowed")
    }

    console.log("Starting food analysis...")

    // Get the image from the request
    const formData = await req.formData()
    const imageFile = formData.get("image") as File
    
    if (!imageFile) {
      throw new Error("No image file provided")
    }

    console.log("Image received:", imageFile.name, imageFile.size, "bytes")

    // Get API keys from environment
    const mistralApiKey = Deno.env.get("MISTRAL_API_KEY")
    const imagebbApiKey = Deno.env.get("IMAGEBB_API_KEY")

    if (!mistralApiKey || !imagebbApiKey) {
      console.error("Missing API keys:", { 
        hasMistral: !!mistralApiKey, 
        hasImagebb: !!imagebbApiKey 
      })
      throw new Error("API keys not configured")
    }

    console.log("API keys found, uploading image to ImageBB...")

    // Convert File to base64 for ImageBB using iterative approach
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = arrayBufferToBase64(arrayBuffer)

    // Upload image to ImageBB
    const uploadFormData = new FormData()
    uploadFormData.append("image", base64)
    uploadFormData.append("expiration", "60")

    const uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${imagebbApiKey}`,
      {
        method: "POST",
        body: uploadFormData,
      }
    )

    const uploadData = await uploadResponse.json()
    
    console.log("ImageBB response:", uploadData)
    
    if (!uploadData.success) {
      throw new Error(`Failed to upload image: ${uploadData.error?.message || 'Unknown error'}`)
    }

    console.log("Image uploaded successfully, analyzing with Mistral AI...")

    // Analyze with Mistral AI
    const chatResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: "pixtral-12b-2409",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Identify the food items in the image and return only a structured JSON response in the following format:
{
  "food_items": [
    {
      "item": "",
      "calories": "",
      "protein": "",
      "fat": "",
      "vitamin_e": "",
      "carbohydrates": "",
      "fiber": "",
      "iron": ""
    }
  ]
}
Ensure the response is for the entire plate, summing up all the individual pieces. Ensure the response is valid JSON without any additional text, explanations, or formatting outside the JSON structure.`,
              },
              {
                type: "image_url",
                image_url: uploadData.data.url,
              },
            ],
          },
        ],
      }),
    })

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text()
      console.error("Mistral API error:", chatResponse.status, errorText)
      throw new Error(`Mistral API error: ${chatResponse.statusText}`)
    }

    const chatData = await chatResponse.json()
    console.log("Mistral AI response:", chatData)

    // Get the raw response content
    const rawContent = chatData?.choices?.[0]?.message?.content
    
    if (!rawContent || typeof rawContent !== "string") {
      throw new Error("No valid response content from AI analysis")
    }

    console.log("Raw AI response content:", rawContent)

    // Use the robust JSON extraction function
    let extractedJson: string
    try {
      extractedJson = extractJsonFromResponse(rawContent)
    } catch (extractError) {
      console.error("JSON extraction error:", extractError.message)
      throw new Error(`Failed to extract JSON from AI response: ${extractError.message}`)
    }

    console.log("Extracted JSON:", extractedJson)

    // Parse the extracted JSON
    let parsedResponse: AnalysisResponse
    try {
      parsedResponse = JSON.parse(extractedJson)
    } catch (parseError) {
      console.error("Final JSON parse error:", parseError, "Extracted JSON:", extractedJson)
      throw new Error(`Invalid JSON structure: ${parseError.message}`)
    }
    
    // Validate the structure
    if (!parsedResponse.food_items || !Array.isArray(parsedResponse.food_items)) {
      throw new Error("Invalid response structure: missing or invalid food_items array")
    }
    
    console.log("Analysis complete:", parsedResponse)
    
    return new Response(
      JSON.stringify({
        success: true,
        data: parsedResponse
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )

  } catch (error) {
    console.error("Food analysis error:", error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to analyze food image",
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )
  }
})