import { NextResponse } from "next/server";

export function GET(req: any, res: any) {
    return new NextResponse(JSON.stringify({
        message: "Hello, this is a demo API!",
        status: "success",
        timestamp: new Date().toISOString(),
    }));
}
