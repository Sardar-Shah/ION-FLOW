import React, { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, RefreshCw, X, Server, ShieldCheck } from 'lucide-react';
import { IDatabaseStatus, api } from '../api.ts';

interface DbStatusModalProps {
  status: IDatabaseStatus | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const DbStatusModal: React.FC<DbStatusModalProps> = ({
  status,
  isOpen,
  onClose,
  onRefresh
}) => {
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  if (!isOpen) return null;

  const handleRetry = async () => {
    setRetrying(true);
    setSeedResult(null);
    try {
      const res = await api.retryDbConnection();
      if (res.connected) {
        setSeedResult('Successfully connected to MongoDB Atlas cluster!');
      } else {
        setSeedResult(res.message || 'Connection attempt completed.');
      }
      onRefresh();
    } catch (err: any) {
      setSeedResult(`Connection attempt: ${err.message}`);
    } finally {
      setRetrying(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResult(null);
    try {
      const res = await api.triggerSeed();
      setSeedResult(res.message);
      onRefresh();
    } catch (err: any) {
      setSeedResult(`Seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 text-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              status?.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              MongoDB Atlas Connection
            </h3>
            <p className="text-xs text-slate-500">
              Database verification & configuration diagnostics
            </p>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Connection State:</span>
            <div className="flex items-center gap-1.5">
              {status?.connected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Connected & Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-amber-700">
                    {status?.status === 'missing_uri' ? 'URI Secret Pending' : 'Offline / Checking'}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Target Database:</span>
            <span className="font-mono text-slate-800">careerpath_ai</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Cluster Host:</span>
            <span className="font-mono text-slate-800">ionflow.skdrbqo.mongodb.net</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Application Name:</span>
            <span className="font-mono text-slate-800">IONFLOW</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Seeded Careers Count:</span>
            <span className="font-semibold text-slate-800">
              {status?.careerCount !== undefined ? `${status.careerCount} / 12 careers loaded` : '12 available in fallback'}
            </span>
          </div>
        </div>

        {/* Diagnostic Action Guidance */}
        {!status?.connected && (
          <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 mb-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <Server className="w-4 h-4 text-amber-700" />
              <span>Required Server Configuration:</span>
            </div>
            <p>
              Set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">MONGODB_URI</code> in Google AI Studio Server Secrets:
            </p>
            <div className="p-2 bg-white rounded border border-amber-200 font-mono text-[11px] text-slate-700 select-all break-all">
              mongodb+srv://&lt;DB_USERNAME&gt;:&lt;NEW_PASSWORD&gt;@ionflow.skdrbqo.mongodb.net/careerpath_ai?appName=IONFLOW
            </div>
            <p className="text-[11px] text-amber-800">
              Note: Ensure MongoDB Atlas Network Access has IP Whitelist enabled (0.0.0.0/0) to allow serverless connections.
            </p>
          </div>
        )}

        {seedResult && (
          <div className="p-3 mb-4 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-900">
            {seedResult}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          {!status?.connected && (
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${retrying ? 'animate-spin' : ''}`} />
              <span>{retrying ? 'Connecting...' : 'Retry Connection Now'}</span>
            </button>
          )}
          <button
            onClick={onRefresh}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recheck</span>
          </button>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{seeding ? 'Seeding...' : 'Run Seed Script'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
