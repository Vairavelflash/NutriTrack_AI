import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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

serve(async (req: Request) => {
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

    // Convert File to base64 for ImageBB
    const arrayBuffer = await imageFile.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

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

    // Parse the response
    const cleanedText = chatData?.choices?.[0]?.message?.content &&
      typeof chatData.choices[0].message.content === "string"
        ? chatData.choices[0].message.content.replace(/```json|```/g, "").trim()
        : ""

    if (!cleanedText) {
      throw new Error("No response from AI analysis")
    }

    console.log("Cleaned response text:", cleanedText)

    let parsedResponse: AnalysisResponse
    try {
      parsedResponse = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Raw text:", cleanedText)
      throw new Error("Invalid JSON response from AI")
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