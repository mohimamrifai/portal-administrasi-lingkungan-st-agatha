import { NotificationClient } from "../components/notification-client";

export default async function NotificationDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  return (
    <NotificationClient id={id} />
  );
} 