import React from 'react';

/**
 * ErrorBoundary catches runtime errors in the component tree
 * and displays a fallback UI instead of crashing the entire app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
    });

    try {
      console.error('ErrorBoundary caught:', {
        message: error.message,
        stack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      // Silently fail
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
    });
    window.location.reload();
  };

  handleClearSave = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('This will delete all saved game data. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0e14',
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              background: '#131a26',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
            }}
          >
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ef4444',
                marginTop: 0,
                marginBottom: '16px',
              }}
            >
              ⚠️ Something went wrong
            </h1>

            <p
              style={{
                fontSize: '14px',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '20px',
              }}
            >
              The game encountered an unexpected error. Try restarting the game or clearing your
              saved data if the problem persists.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ef4444',
                    marginBottom: '8px',
                  }}
                >
                  Error Details:
                </div>
                <code
                  style={{
                    fontSize: '12px',
                    color: '#fca5a5',
                    fontFamily: 'monospace',
                    display: 'block',
                    maxHeight: '150px',
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message || String(this.state.error)}
                </code>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🔄 Restart Game
              </button>

              <button
                onClick={this.handleClearSave}
                style={{
                  flex: 1,
                  minWidth: '120px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                🗑️ Clear Save Data
              </button>
            </div>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '12px',
                color: '#64748b',
              }}
            >
              Tip: Check the browser console (F12) for more detailed error logs.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
