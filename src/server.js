const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load product data
const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Routes

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by name
app.get('/api/products/search', (req, res) => {
  const query = req.query.name?.toLowerCase() || '';
  
  if (!query) {
    return res.status(400).json({ error: 'Product name is required' });
  }

  // Find the product that best matches the query
  const matchedProducts = products.filter(product => 
    product.name.toLowerCase().includes(query)
  );

  if (matchedProducts.length === 0) {
    return res.status(404).json({ 
      error: 'No product found',
      // Return default values
      data: {
        ingredients: [],
        nutritionalInfo: {
          calories: 0,
          protein: '0g',
          carbs: '0g',
          fat: '0g'
        }
      }
    });
  }

  // Sort by closest match
  matchedProducts.sort((a, b) => {
    const aScore = getMatchScore(a.name.toLowerCase(), query);
    const bScore = getMatchScore(b.name.toLowerCase(), query);
    return bScore - aScore;
  });

  // Return the best match
  res.json({
    ingredients: matchedProducts[0].ingredients,
    nutritionalInfo: matchedProducts[0].nutritionalInfo
  });
});

// Helper function to calculate match score
function getMatchScore(text, query) {
  if (text === query) return 100; // Exact match
  if (text.startsWith(query)) return 80; // Starts with query
  if (text.includes(query)) return 60; // Contains query
  
  // Calculate Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(text, query);
  const maxLength = Math.max(text.length, query.length);
  const similarity = 1 - (distance / maxLength);
  
  return similarity * 50; // Scale to 0-50 for more distant matches
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Create a matrix of size (m+1) x (n+1)
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Fill the first row and column
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  // Fill the rest of the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return dp[m][n];
}

// Start the server
app.listen(PORT, () => {
  console.log(`Nutritional API server running on port ${PORT}`);
}); 