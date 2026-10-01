import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleResetCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 font-inter text-[#172033]">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-[#D9E2EC] p-6 sm:p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF5FC] text-[#0969C7] text-xs font-semibold mb-2">
              <ShieldAlert size={13} />
              <span>Application Safeguard Active</span>
            </div>

            <h1 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A] mb-2">
              Temporary Display Notice
            </h1>

            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-6">
              A temporary display error was safely intercepted by the system safeguard. Your connection and data remain secure.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <RefreshCw size={15} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Home size={15} />
                <span>Return to Homepage</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
              >
                Clear Local Cache &amp; Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
