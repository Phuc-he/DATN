/**
 * Matches org.datn.backend.domain.entity.WebSetting
 */
export class WebSetting {
  // UUID string (length 36)
  id: number;

  webName: string;
  logoUrl?: string; // Image URL
  headerIcon?: string; // Lucide icon name (e.g., 'BookOpen')
  contactEmail?: string;
  footerText?: string;
  isActive: boolean;
  
  /**
   * ISO String format: "2026-03-21T19:02:27"
   */
  updatedAt?: string;

  constructor(data: Partial<WebSetting>) {
    this.id = data.id || 0;
    this.webName = data.webName || 'My Bookstore';
    this.logoUrl = data.logoUrl;
    this.headerIcon = data.headerIcon || 'BookOpen';
    this.contactEmail = data.contactEmail;
    this.footerText = data.footerText;
    this.isActive = data.isActive ?? true;
    this.updatedAt = data.updatedAt;
  }
}