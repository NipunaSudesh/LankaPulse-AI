import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const apiUrl = process.env.LARAVEL_API_URL;
    const publishSecret = process.env.FACEBOOK_PUBLISH_SECRET;

    if (!apiUrl || !publishSecret) {
      return NextResponse.json(
        { message: "Facebook publishing server configuration is missing." },
        { status: 500 }
      );
    }

    const incomingForm = await request.formData();

    const articleId = incomingForm.get("article_id");
    const message = incomingForm.get("message");
    const image = incomingForm.get("image");

    if (!articleId || !message || !(image instanceof File)) {
      return NextResponse.json(
        { message: "Article, caption and image are required." },
        { status: 422 }
      );
    }

    const outgoingForm = new FormData();

    outgoingForm.append("article_id", articleId);
    outgoingForm.append("message", message);
    outgoingForm.append("image", image, image.name || "lankapulse-post.png");

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/facebook-posts/publish`,
      {
        method: "POST",
        headers: {
          "X-Facebook-Publish-Key": publishSecret,
          Accept: "application/json",
        },
        body: outgoingForm,
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Facebook publishing proxy error:", error);

    return NextResponse.json(
      { message: "Unable to contact the publishing server." },
      { status: 500 }
    );
  }
}