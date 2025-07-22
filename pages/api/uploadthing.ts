// pages/api/uploadthing.ts
import { createRouteHandler } from "uploadthing/next-legacy";
import { ourFileRouter } from "../../server/uploadthing";   // ← adjust if you moved it

/**
 * Pages-Router API routes must export a DEFAULT function.
 * createRouteHandler returns one for us.
 */
export default createRouteHandler({
  router: ourFileRouter,
  
});
