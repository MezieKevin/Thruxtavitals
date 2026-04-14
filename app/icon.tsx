import { ImageResponse } from "next/og";

/** Required for `output: "export"` — icon is generated at build time. */
export const dynamic = "force-static";

/** High-res source; browsers scale down for the tab. */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          color: "#ffffff",
          fontSize: 52,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          textAlign: "center",
          padding: "0 36px",
          lineHeight: 1.1,
        }}
      >
        Thruxta Vitals
      </div>
    ),
    { ...size },
  );
}
