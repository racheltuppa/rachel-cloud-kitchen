require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

// API Endpoint: Receive a new order and save to Supabase
app.post('/api/orders', async (req, res) => {
    const { customerName, items, total } = req.body;

    if (!customerName || !items || items.length === 0) {
        return res.status(400).json({ error: 'Invalid order data.' });
    }

    // Insert order into PostgreSQL Database
    const { data, error } = await supabase
        .from('orders')
        .insert([
            { 
                customer_name: customerName, 
                items: items, 
                total: total, 
                status: 'Preparing' 
            }
        ])
        .select();

    if (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Failed to save order to database.' });
    }

    console.log('🍽️ New Order Saved:', data);
    res.status(201).json({ message: 'Order placed successfully!', order: data });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Rachel Cloud Kitchen is live on port ${PORT}`);
});
