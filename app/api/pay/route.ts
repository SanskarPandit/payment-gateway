import { NextResponse } from "next/server";
import type { PayApiResponse } from "@/types/payment";

interface PayBody {
  transactionId?: string;
  amount?: number;
  currency?: string;
}
 
export async function POST(req: Request) {
  let body: PayBody = {};
  try {
    body = (await req.json()) as PayBody;
  } catch {
    return NextResponse.json({ status: "failed", reason: "Invalid request" }, { status: 400 });
  }

  if (!body.transactionId || typeof body.amount !== "number" || !body.currency) {
    return NextResponse.json({ status: "failed", reason: "Missing required fields" }, { status: 400 });
  }

  const roll = Math.random();

  // 15% timeout — sleep longer than client timeout
  if (roll < 0.15) {
    await sleep(8000);
    const res: PayApiResponse = { status: "success" };
    return NextResponse.json(res);
  }
 
  await sleep(700 + Math.random() * 800);
 
  if (roll < 0.4) {
    const reasons = [
      "Insufficient funds",
      "Card declined by issuer",
      "Do not honor",
      "Suspected fraud",
    ];
    const res: PayApiResponse = {
      status: "failed",
      reason: reasons[Math.floor(Math.random() * reasons.length)],
    };
    return NextResponse.json(res);
  }
 
  const res: PayApiResponse = { status: "success" };
  return NextResponse.json(res);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
