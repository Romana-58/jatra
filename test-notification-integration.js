#!/usr/bin/env node
/**
 * Integration test for notification flow
 * Publishes a mock payment.completed event to RabbitMQ to test notification service
 */

const amqp = require("amqplib");

async function testNotificationFlow() {
  const RABBITMQ_URL = "amqp://jatra_user:jatra_password@localhost:5672/jatra";

  console.log("🔌 Connecting to RabbitMQ...");

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    console.log("✅ Connected to RabbitMQ");

    // Mock payment completed event
    const testEvent = {
      type: "payment.completed",
      data: {
        paymentId: "123e4567-e89b-12d3-a456-426614174000",
        reservationId: "123e4567-e89b-12d3-a456-426614174001",
        userId: "123e4567-e89b-12d3-a456-426614174002",
        amount: 500,
        status: "COMPLETED",
        transactionId: "TXN_TEST_123456",
        bookingId: "123e4567-e89b-12d3-a456-426614174003",
        customerName: "Test User",
        customerEmail: "test@example.com",
        customerPhone: "+8801712345678",
        trainName: "Suborno Express",
        journeyDate: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    console.log("\n📤 Publishing payment.completed event...");
    console.log("Event data:", JSON.stringify(testEvent, null, 2));

    // Publish to payment.exchange with routing key payment.completed
    channel.publish(
      "payment.exchange",
      "payment.completed",
      Buffer.from(JSON.stringify(testEvent)),
      { persistent: true }
    );

    console.log("\n✅ Event published successfully!");
    console.log("\n📋 Expected behavior:");
    console.log(
      "1. Notification service should consume the event from notification.events queue"
    );
    console.log("2. Mock email provider should log email details to console");
    console.log("3. Mock SMS provider should log SMS details to console");
    console.log("\n👀 Check the notification service terminal for logs...\n");

    // Wait a bit for message to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await channel.close();
    await connection.close();

    console.log("🔌 Disconnected from RabbitMQ");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testNotificationFlow();
