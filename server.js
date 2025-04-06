require("dotenv").config();
const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Stripe Payment Intent API route
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
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Payment success route
app.post("/payment-success", (req, res) => {
  const { paymentIntentId, amount, email, name, package: pkg } = req.body;

  console.log("✅ Payment Success Details:", {
    paymentIntentId,
    amount,
    email,
    name,
    package: pkg,
  });

  res.status(200).json({ message: "Payment success received" });
});

// Fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
