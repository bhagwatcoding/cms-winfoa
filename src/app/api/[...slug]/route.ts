import { NextResponse } from "next/server";

const notFoundResponse = () => {
  return NextResponse.json(
    {
      error: "Not Found",
      message: "The requested API endpoint does not exist.",
      status: 404,
    },
    { status: 404 }
  );
};

export async function GET() {
  return notFoundResponse();
}

export async function POST() {
  return notFoundResponse();
}

export async function PUT() {
  return notFoundResponse();
}

export async function DELETE() {
  return notFoundResponse();
}

export async function PATCH() {
  return notFoundResponse();
}

export async function HEAD() {
  return notFoundResponse();
}

export async function OPTIONS() {
  return notFoundResponse();
}
