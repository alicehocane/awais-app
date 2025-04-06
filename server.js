require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // required!

// Payment Intent route
app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Frontend fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server (with fallback)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
