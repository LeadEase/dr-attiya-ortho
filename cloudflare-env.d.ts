declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    RESEND_API_KEY?: string;
    ENQUIRIES_TO_EMAIL?: string;
    ENQUIRIES_FROM_EMAIL?: string;
    NEXT_PUBLIC_TRACKING_PHONE_DISPLAY?: string;
    NEXT_PUBLIC_TRACKING_PHONE_E164?: string;
  }
}
