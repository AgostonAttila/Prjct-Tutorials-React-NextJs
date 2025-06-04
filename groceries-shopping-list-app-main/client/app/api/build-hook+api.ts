import crypto from "crypto";

async function sendTelegramMessage(message: string) {
  const TELEGRAM_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(TELEGRAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_GROUP_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

export async function POST(request: Request) {
  try {
    console.log("📱 Expo webhook received");

    const expoSignature = request.headers.get("expo-signature");
    if (!expoSignature) {
      console.error("❌ No signature provided");
      return new Response("No signature provided", { status: 401 });
    }

    if (!process.env.EXPO_WEBHOOK_SECRET) {
      console.error("❌ EXPO_WEBHOOK_SECRET not configured");
      return new Response("Server configuration error", { status: 500 });
    }

    const body = await request.text();

    // Log signature verification attempt
    console.log("🔑 Verifying signature...");

    const hmac = crypto.createHmac("sha1", process.env.EXPO_WEBHOOK_SECRET);
    hmac.update(body);
    const hash = `sha1=${hmac.digest("hex")}`;

    if (expoSignature !== hash) {
      console.error("❌ Signature verification failed");
      return new Response("Invalid signature", { status: 403 });
    }

    // Log successful verification and payload
    console.log("✅ Signature verified successfully");

    const payload = JSON.parse(body);

    // Create a meaningful message with relevant build info
    const buildStatus = payload.status.toUpperCase();
    const statusEmoji =
      payload.status === "finished"
        ? "✅"
        : payload.status === "errored"
        ? "❌"
        : "⚠️";

    const message = `
${statusEmoji} Build ${buildStatus}

🔧 Project: ${payload.projectName}
📱 Platform: ${payload.platform}
🏷️ Version: ${payload.metadata.appVersion} (${payload.metadata.appBuildVersion})
${
  payload.metadata.gitCommitMessage
    ? `📝 Commit: ${payload.metadata.gitCommitMessage}`
    : ""
}
${
  payload.buildDetailsPageUrl
    ? `\n🔍 Details: ${payload.buildDetailsPageUrl}`
    : ""
}
${
  payload.artifacts?.buildUrl
    ? `\n📦 Build URL: ${payload.artifacts.buildUrl}`
    : ""
}
${payload.error ? `\n⚠️ Error: ${payload.error.message}` : ""}
    `.trim();

    await sendTelegramMessage(message);
    console.log("📨 Telegram notification sent");

    return new Response("OK!", { status: 200 });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
