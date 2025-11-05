import { PDFGenerator } from "./generator";
import { ResumeData } from "@/types/resume";

export class ResumeService {
  private pdfGenerator: PDFGenerator;

  constructor() {
    this.pdfGenerator = new PDFGenerator();
  }

  public async generatePDF(data: ResumeData): Promise<{
    buffer: Buffer;
    cached: boolean;
  }> {
    const cacheKey = data.id;

    try {
      // Check if PDF exists in cache
      // const exists = await PDFGenerator.checkPDFExists(cacheKey);
      // if (exists) {
      //   const pdfUrl = await PDFGenerator.getPDFUrl(cacheKey);
      //   if (pdfUrl) {
      //     try {
      //       const response = await fetch(pdfUrl);
      //       if (response.ok) {
      //         const buffer = Buffer.from(await response.arrayBuffer());

      //         // Validate PDF buffer
      //         if (
      //           buffer.length > 100 &&
      //           buffer.toString("ascii", 0, 5).includes("%PDF")
      //         ) {
      //           return { buffer, cached: true };
      //         }
      //       }
      //     } catch (fetchError) {
      //       console.warn(
      //         `Failed to fetch cached PDF ${cacheKey}, regenerating:`,
      //         fetchError
      //       );
      //       // Continue to generate new PDF
      //     }
      //   }
      // }

      // Generate new PDF using applicationId
      console.log(`Generating PDF for application: ${data.id}`);
      const outputPath = `job-applications/${cacheKey}.pdf`;
      const buffer = await this.pdfGenerator.generatePDF(data.id, {
        outputPath,
        cacheKey,
      });

      console.log(`Generated PDF buffer (${buffer.length} bytes)`);

      // Validate generated PDF
      if (
        buffer.length < 100 ||
        !buffer.toString("ascii", 0, 5).includes("%PDF")
      ) {
        throw new Error("Generated PDF is corrupt");
      }

      return { buffer, cached: false };
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw new Error(
        `PDF generation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  public async generateBulkPDFs(
    applications: ResumeData[],
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
        cached: await PDFGenerator.checkPDFExists(app.id),
      }))
    );

    // Get cached PDFs
    const cachedPromises = cacheChecks
      .filter((check) => check.cached)
      .map(async (check) => {
        const pdfUrl = await PDFGenerator.getPDFUrl(check.id);
        if (pdfUrl) {
          const response = await fetch(pdfUrl);
          const buffer = Buffer.from(await response.arrayBuffer());
          cached++;
          return { id: check.id, buffer };
        }
        return null;
      });

    const cachedResults = (await Promise.all(cachedPromises)).filter(
      (result): result is { id: string; buffer: Buffer } => result !== null
    );
    results.push(...cachedResults);

    // Generate remaining PDFs
    const toGenerate = applications.filter(
      (app) => !cacheChecks.find((check) => check.id === app.id)?.cached
    );

    if (toGenerate.length > 0) {
      const jobs = toGenerate.map((app) => ({
        applicationId: app.id,
        outputPath: `job-applications/${app.id}.pdf`,
        cacheKey: app.id,
      }));

      const generatedPDFs = await this.pdfGenerator.generateMultiplePDFs(
        jobs,
        concurrency
      );

      results.push(
        ...generatedPDFs.map(({ outputPath, buffer }) => ({
          id: outputPath.replace("job-applications/", "").replace(".pdf", ""),
          buffer,
        }))
      );
      generated = generatedPDFs.length;
    }

    return { buffers: results, cached, generated };
  }
}

// Export singleton instance
export const resumeService = new ResumeService();
