import { createResumeDocument } from "@/lib/pdf/ResumeDocument";
import { pdfCacheService } from "@/lib/pdf/cache";
import { renderToStream } from "@react-pdf/renderer";

export async function generateBulkPDFs(
    applications: any[],
    concurrency: number = 5
  ): Promise<{
    buffers: Array<{ id: string; buffer: Buffer }>;
    cached: number;
    generated: number;
  }> {
    const results: Array<{ id: string; buffer: Buffer }> = [];
    let cached = 0;
    let generated = 0;
  
    // Check cache first for all applications
    const cacheChecks = await Promise.all(
      applications.map(async (app) => ({
        id: app.id,
        cached: await pdfCacheService.exists(app.id),
      }))
    );
  
    // Get cached PDFs
    const cachedPromises = cacheChecks
      .filter((check) => check.cached)
      .map(async (check) => {
        const buffer = await pdfCacheService.getCachedPDF(check.id);
        if (buffer) {
          cached++;
          return { id: check.id, buffer };
        }
        return null;
      });
  
    const cachedResults = (await Promise.all(cachedPromises)).filter(
      (result): result is { id: string; buffer: Buffer } => result !== null
    );
    results.push(...cachedResults);
  
    // Get applications that need generation
    const toGenerate = applications.filter(
      (app) => !cacheChecks.find((check) => check.id === app.id)?.cached
    );
  
    if (toGenerate.length > 0) {
      // Split into chunks for controlled concurrency
      const chunks = [];
      for (let i = 0; i < toGenerate.length; i += concurrency) {
        chunks.push(toGenerate.slice(i, i + concurrency));
      }
  
      // Process chunks sequentially, jobs within chunk concurrently
      for (const chunk of chunks) {
        const chunkResults = await Promise.all(
          chunk.map(async (app) => {
            try {
              // Generate PDF
              const pdfStream = await renderToStream(
                createResumeDocument(app)
              );
  
              // Convert stream to buffer
              const chunks: any[] = [];
              for await (const chunk of pdfStream) {
                chunks.push(Buffer.from(chunk as any));
              }
              const buffer: Buffer = Buffer.concat(chunks);
  
              // Validate PDF
              const header = buffer.subarray(0, 5).toString("ascii");
              if (buffer.length < 100 || !header.includes("%PDF")) {
                throw new Error(`Generated PDF is corrupt for ${app.id}`);
              }
  
              // Cache asynchronously (don't block)
              pdfCacheService
                .cachePDF(app.id, buffer, app.full_name)
                .catch((err) => {
                  console.error(`Failed to cache PDF for ${app.id}:`, err);
                });
  
              generated++;
              return { id: app.id, buffer };
            } catch (error) {
              console.error(`Failed to generate PDF for ${app.id}:`, error);
              return null;
            }
          })
        );
  
        // Filter out failed generations
        const successfulResults = chunkResults.filter(
          (result): result is { id: string; buffer: Buffer } => result !== null
        );
        results.push(...successfulResults);
      }
    }
  
    return { buffers: results, cached, generated };
  }