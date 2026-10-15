import { authenticateRequest } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { ApiError } from '@/api/errors';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await authenticateRequest(request, 'USER');
    const pool = getDatabaseClients().pool;

    // We use a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        // Acquire a dedicated connection for LISTEN
        const client = await pool.connect();

        const channelName = `user_notifications_${session.principal.id.replace(/-/g, '_')}`;
        
        // Listen to Postgres Notifications
        client.on('notification', (msg) => {
          if (msg.channel === channelName) {
            const data = msg.payload || '{}';
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
          }
        });

        await client.query(`LISTEN ${channelName}`);
        
        // Keep-alive ping every 15 seconds to prevent timeout
        const pingInterval = setInterval(() => {
          try {
            controller.enqueue(new TextEncoder().encode(`: ping\n\n`));
          } catch (e) {
            // Stream closed
            clearInterval(pingInterval);
          }
        }, 15000);

        // When the client disconnects, clean up
        request.signal.addEventListener('abort', () => {
          clearInterval(pingInterval);
          client.query(`UNLISTEN ${channelName}`).catch(() => {});
          client.release();
          try { controller.close(); } catch (e) {}
        });
      },
      cancel() {
        // Cancellation handled by abort signal above
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    const isApiError = error instanceof ApiError;
    return new Response(JSON.stringify({ error: isApiError ? error.message : 'Unauthorized' }), {
      status: isApiError ? error.status : 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
