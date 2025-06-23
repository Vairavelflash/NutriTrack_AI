import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { Mistral } from '@mistralai/mistralai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mistral AI client
const mistralClient = new Mistral({ 
  apiKey: process.env.MISTRAL_API_KEY 
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        display_name: username
      },
      email_confirm: false
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.display_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.display_name || 'User'
      },
      session: data.session
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Image analysis endpoint
app.post('/api/analyze-food', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload image to ImageBB
    const formData = new FormData();
    const imageBlob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append('image', imageBlob);
    formData.append('expiration', '60');

    const uploadResponse = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMAGEBB_API_KEY}`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const uploadData = await uploadResponse.json();
    
    if (!uploadData.success) {
      throw new Error('Failed to upload image');
    }

    // Analyze with Mistral AI
    const chatResponse = await mistralClient.chat.complete({
      model: "pixtral-12b",
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
              imageUrl: uploadData.data.url,
            },
          ],
        },
      ],
    });

    // Parse the response
    const cleanedText = chatResponse?.choices?.[0]?.message?.content &&
      typeof chatResponse.choices[0].message.content === "string"
        ? chatResponse.choices[0].message.content.replace(/```json|```/g, "").trim()
        : "";

    if (!cleanedText) {
      throw new Error("No response from AI analysis");
    }

    const parsedResponse = JSON.parse(cleanedText);
    
    res.json({
      success: true,
      data: parsedResponse
    });

  } catch (error) {
    console.error('Food analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze food image',
      details: error.message 
    });
  }
});

// Save nutrition data
app.post('/api/nutrition/save', authenticateToken, async (req, res) => {
  try {
    const {
      meal_name,
      meal_date,
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
      total_fiber,
      total_vitamin_e,
      total_iron,
      food_items
    } = req.body;

    if (!meal_name || !food_items) {
      return res.status(400).json({ error: 'Meal name and food items are required' });
    }

    const { data, error } = await supabase
      .from('nutrition_entries')
      .insert({
        user_id: req.user.id,
        username: req.user.user_metadata?.display_name || 'User',
        meal_name,
        meal_date: meal_date || new Date().toISOString().split('T')[0],
        total_calories: parseFloat(total_calories) || 0,
        total_protein: parseFloat(total_protein) || 0,
        total_carbs: parseFloat(total_carbs) || 0,
        total_fat: parseFloat(total_fat) || 0,
        total_fiber: parseFloat(total_fiber) || 0,
        total_vitamin_e: parseFloat(total_vitamin_e) || 0,
        total_iron: parseFloat(total_iron) || 0,
        food_items
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Nutrition data saved successfully',
      data
    });

  } catch (error) {
    console.error('Save nutrition error:', error);
    res.status(500).json({ 
      error: 'Failed to save nutrition data',
      details: error.message 
    });
  }
});

// Get nutrition history
app.get('/api/nutrition/history', authenticateToken, async (req, res) => {
  try {
    const { date, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('nutrition_entries')
      .select('*')
      .eq('user_id', req.user.id)
      .order('meal_date', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (date) {
      query = query.eq('meal_date', date);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: data?.length || 0
      }
    });

  } catch (error) {
    console.error('Get nutrition history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nutrition history',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});