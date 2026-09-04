import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Claude Code Learning Hub - Master AI-Powered Development'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            Claude Code
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            background:
              'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: 24,
            padding: '0 40px',
          }}
        >
          Learning Hub
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Master AI-Powered Development with Claude Code, VS Code, Git, Python &
          R
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            gap: 32,
          }}
        >
          {['Hands-on Tutorials', 'Real Projects', 'Free & Open'].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 24px',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: '#f59e0b',
                    marginRight: 12,
                  }}
                />
                <span
                  style={{
                    color: '#fbbf24',
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </span>
              </div>
            )
          )}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#64748b',
          }}
        >
          codewithclaude.net
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
