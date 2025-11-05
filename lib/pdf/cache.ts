// lib/pdf/cache.ts
import { supabase } from "@/lib/supabase";
import { LRUCache } from "lru-cache";

// In-memory cache for quick lookups
const memoryCache = new LRUCache<string, boolean>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
});

class PDFCacheService {
  private getStoragePath(applicationId: string): string {
    return `job-applications/${applicationId}.pdf`;
  }

  /**
   * Check if PDF exists in cache (memory or storage)
   */
  async exists(applicationId: string): Promise<boolean> {
    // Check memory cache first
    if (memoryCache.has(applicationId)) {
      return true;
    }

    // Check Supabase storage
    try {
      const { data, error } = await supabase.storage
        .from("assets")
        .list("job-applications", {
          search: `${applicationId}.pdf`,
        });

      if (error) {
        console.error("Error checking PDF existence:", error);
        return false;
      }

      const fileExists =
        data && data.length > 0 && data[0].name === `${applicationId}.pdf`;

      if (fileExists) {
        memoryCache.set(applicationId, true);
      }

      return fileExists;
    } catch (error) {
      console.error("Error checking PDF existence:", error);
      return false;
    }
  }

  /**
   * Get cached PDF buffer if it exists
   */
  async getCachedPDF(applicationId: string): Promise<Buffer | null> {
    try {
      const exists = await this.exists(applicationId);
      if (!exists) {
        return null;
      }

      // Get public URL
      const { data } = await supabase.storage
        .from("assets")
        .getPublicUrl(this.getStoragePath(applicationId));

      if (!data?.publicUrl) {
        return null;
      }

      // Fetch the PDF
      const response = await fetch(data.publicUrl);
      if (!response.ok) {
        console.error("Failed to fetch cached PDF:", response.statusText);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Validate PDF by checking the header
      const header = buffer.subarray(0, 5).toString("ascii");
      if (buffer.length > 100 && header.includes("%PDF")) {
        return buffer;
      }

      console.warn("Cached PDF is corrupt, will regenerate");
      return null;
    } catch (error) {
      console.error("Error fetching cached PDF:", error);
      return null;
    }
  }

  /**
   * Cache a PDF to Supabase storage
   */
  async cachePDF(
    applicationId: string,
    buffer: Buffer,
    fullName?: string
  ): Promise<void> {
    try {
      const storagePath = this.getStoragePath(applicationId);

      const { error: uploadError } = await supabase.storage
        .from("assets")
        .upload(storagePath, buffer, {
          contentType: "application/pdf",
          upsert: true,
          cacheControl: "3600", // 1 hour cache
        });

      if (uploadError) {
        throw new Error(`Failed to upload PDF: ${uploadError.message}`);
      }

      // Update memory cache
      memoryCache.set(applicationId, true);

      console.log(
        `Cached PDF for ${fullName || applicationId} (${buffer.length} bytes)`
      );
    } catch (error) {
      console.error("Error caching PDF:", error);
      throw error;
    }
  }

  /**
   * Invalidate cache for an application
   */
  async invalidate(applicationId: string): Promise<void> {
    try {
      // Remove from memory cache
      memoryCache.delete(applicationId);

      // Delete from storage
      const { error } = await supabase.storage
        .from("assets")
        .remove([this.getStoragePath(applicationId)]);

      if (error) {
        console.error("Error invalidating PDF cache:", error);
      }
    } catch (error) {
      console.error("Error invalidating PDF cache:", error);
    }
  }

  /**
   * Bulk cache check for multiple applications
   */
  async checkMultiple(applicationIds: string[]): Promise<{
    cached: string[];
    uncached: string[];
  }> {
    const results = await Promise.all(
      applicationIds.map(async (id) => ({
        id,
        exists: await this.exists(id),
      }))
    );

    return {
      cached: results.filter((r) => r.exists).map((r) => r.id),
      uncached: results.filter((r) => !r.exists).map((r) => r.id),
    };
  }
}

// Export singleton instance
export const pdfCacheService = new PDFCacheService();