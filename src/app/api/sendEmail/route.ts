import { NextResponse } from "next/server";
import { sendEmail } from "@/services/email/sendEmailServer";
import { isValidEmail } from "@/validations/validationsServer/email";

export async function POST(req: Request) {
  console.log("send mail");

  try {
    const { toEmail, subjectEmail, textEmail } = await req.json();

    if (!toEmail || !subjectEmail || !textEmail) {
      return NextResponse.json(
        { error: "All fields (toEmail, subjectEmail, textEmail) are required" },
        { status: 400 }
      );
    }

    if (typeof subjectEmail !== "string" || typeof textEmail !== "string") {
      return NextResponse.json(
        { error: "subjectEmail and textEmail must be of type string" },
        { status: 400 }
      );
    }

    if (!isValidEmail(toEmail)) {
      return NextResponse.json(
        { error: "Invalid email format for toEmail" },
        { status: 400 }
      );
    }

    const info = await sendEmail(toEmail, subjectEmail, textEmail);

    if (info.rejected.length > 0 || info.accepted[0] !== toEmail) {
      return NextResponse.json(
        { error: "Failed to send Email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Email sent successfully!" });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send Email" },
      { status: 500 }
    );
  }
}
