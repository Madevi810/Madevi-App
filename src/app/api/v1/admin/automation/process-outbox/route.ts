import { errorResponse, successResponse } from '@/api/response';
import { assertRequestCsrf, authenticateAdmin } from '@/auth/http';
import { getDatabaseClients } from '@/db/client';
import { getDatabaseSchema } from '@/db/schema-name';
import { PostgresNotificationOutbox } from '@/services/outbox';
import { requestIdFromHeaders } from '@/server/request-id';

export const dynamic = 'force-dynamic';

/**
 * High-Level Automation: 
 * This endpoint processes the Notification Outbox. 
 * It acts as an event-driven flush mechanism. When called (e.g., via cron or admin trigger),
 * it claims pending events and processes them.
 */
export async function POST(request: Request) {
  const requestId = requestIdFromHeaders(request.headers);
  try {
    // Both Admin and internal service accounts can trigger this.
    // For now, we secure it via Admin session. In a real cron, we'd use a service token.
    const session = await authenticateAdmin(request);
    await assertRequestCsrf(request, session.sessionId, 'ADMIN');

    const pool = getDatabaseClients().pool;
    const schema = getDatabaseSchema();
    const outbox = new PostgresNotificationOutbox(pool, schema);

    const processed = [];
    const maxEventsToProcess = 50; // batch size
    
    // Automation Loop: Drain the outbox up to maxEventsToProcess
    for (let i = 0; i < maxEventsToProcess; i++) {
      const result = await outbox.deliverNext({
        workerId: `admin-automation-${session.principal.id}`,
      });
      
      if (!result) {
        // No more pending events
        break;
      }
      
      processed.push(result);
    }

    return successResponse({
      message: `Automation cycle completed. Processed ${processed.length} events.`,
      eventsProcessed: processed.length,
      details: processed
    }, requestId);
  } catch (error) {
    return errorResponse(error, requestId);
  }
}
