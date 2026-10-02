type MailResult = {
  sent: boolean;
  skipped?: boolean;
  id?: string;
};

type PasswordResetEmailInput = {
  to: string;
  resetUrl: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM || "Iron Forge <onboarding@resend.dev>";

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<MailResult> {
  if (!resendApiKey) {
    console.log("[Email skipped] RESEND_API_KEY missing", { to, subject, text });
    return { sent: false, skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to,
      subject,
      html,
      text,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Resend email failed");
  }

  return { sent: true, id: data.id };
}

function baseEmailShell(content: string) {
  return `
    <div style="margin:0;background:#0b0d12;padding:32px;font-family:Inter,Arial,sans-serif;color:#f8fafc">
      <div style="max-width:560px;margin:0 auto;background:#151923;border:1px solid #2a3040;border-radius:18px;overflow:hidden">
        <div style="height:4px;background:linear-gradient(90deg,#f97316,#ef4444,#fbbf24)"></div>
        <div style="padding:28px">
          <div style="font-size:24px;font-weight:900;letter-spacing:.5px;margin-bottom:22px">Iron Forge</div>
          ${content}
          <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin-top:28px">
            If you did not request this, you can ignore this email.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmailInput) {
  return sendEmail({
    to,
    subject: "Reset your Iron Forge password",
    text: `Reset your Iron Forge password: ${resetUrl}`,
    html: baseEmailShell(`
      <h1 style="font-size:30px;line-height:1.05;margin:0 0 14px">Reset your password</h1>
      <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 24px">
        This secure reset link expires shortly. Use it to create a new password for your account.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ef4444);color:#fff;text-decoration:none;font-weight:800;border-radius:12px;padding:14px 20px">
        Reset Password
      </a>
      <p style="color:#94a3b8;font-size:12px;line-height:1.6;margin-top:22px;word-break:break-all">${resetUrl}</p>
    `),
  });
}
