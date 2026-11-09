import { NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "helakuru.sgp1.cdn.digitaloceanspaces.com",
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image URL is required." },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(imageUrl);

    if (
      parsedUrl.protocol !== "https:" ||
      !ALLOWED_HOSTS.includes(parsedUrl.hostname)
    ) {
      return NextResponse.json(
        { message: "Image host is not allowed." },
        { status: 403 }
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      signal: AbortSignal.timeout(15000),
      cache: "force-cache",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Unable to retrieve the original image." },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { message: "The requested resource is not an image." },
        { status: 415 }
      );
    }

    return new Response(await response.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Image proxy request failed." },
      { status: 500 }
    );
  }
}