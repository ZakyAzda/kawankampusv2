import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    console.error("Get Notifications Error:", error);
    return NextResponse.json({ error: "Gagal mengambil notifikasi" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const body = await req.json();
    const { id } = body;

    if (id) {
      // Mark specific notification as read
      await prisma.notification.updateMany({
        where: { id, userId: session.userId },
        data: { isRead: true },
      });
    } else {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { userId: session.userId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ message: "Notifikasi diperbarui" });
  } catch (error: any) {
    console.error("Update Notifications Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui notifikasi" }, { status: 500 });
  }
}
