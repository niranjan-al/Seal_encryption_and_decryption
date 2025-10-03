import { fetch as undiciFetch } from "undici";
import { Agent } from "undici";

const MAX_RETRIES = 5;          
const RETRY_DELAY_MS = 1000;   

const walrusAgent = new Agent({
  connectTimeout: 120_000,  // 120 seconds
  connect: { rejectUnauthorized: false },
});

export async function robustFetch(url: string, init?: RequestInit): Promise<Response> {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 1000;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await undiciFetch(url, { ...init, dispatcher: walrusAgent } as any);
      if (!res.ok) throw new Error(`Walrus fetch failed with status ${res.status}`);
      return res as unknown as Response;
    } catch (err: any) {
      if (attempt < MAX_RETRIES - 1) {
        console.warn(`Walrus fetch attempt ${attempt + 1} failed: ${err.message}. Retrying in ${RETRY_DELAY_MS * (attempt + 1)}ms...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Walrus fetch failed after all retry attempts");
}

