import React, { Component, ErrorInfo, ReactNode } from "react";
import { Trash2, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    if (window.confirm("這將清除所有儲存的行程資料並重置為預設值，確定嗎？")) {
      localStorage.removeItem("qing_items");
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#C5FFF8] p-6 text-center font-sans">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💥</span>
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-2">應用程式發生錯誤</h1>
            <p className="text-gray-500 mb-6 text-sm font-bold">
              可能是資料格式版本不相容，或是暫存資料損壞。
              <br />
              <span className="text-xs font-mono bg-gray-100 p-1 rounded mt-2 block overflow-hidden text-ellipsis">
                {this.state.error?.message}
              </span>
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 bg-[#5FBDFF] text-white rounded-xl font-bold hover:bg-[#4CACF0] transition active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> 重新整理頁面
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Trash2 size={18} /> 清除資料並重置
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;