import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const incomingForm = await request.formData();
        const imageFile = incomingForm.get("image");

        if (!imageFile) {
            return NextResponse.json(
                { success: false, data: { error: "No image provided" } },
                { status: 400 }
            );
        }

        // Convert the file to an ArrayBuffer, then to base64
        const arrayBuffer = await imageFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // Send as base64 JSON — avoids FormData boundary issues entirely
        const response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: "Client-ID " + process.env.NEXT_PUBLIC_IMGUR_CLIENT_ID,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64, type: "base64" }),
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        console.error("Imgur upload proxy error:", error);
        return NextResponse.json(
            { success: false, data: { error: "Upload failed on server: " + error.message } },
            { status: 500 }
        );
    }
}
