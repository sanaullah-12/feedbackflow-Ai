import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Type, Upload, Zap, CheckCircle, AlertCircle, X, FileText, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import useTaskStore from '../store/taskStore';
import useAuthStore from '../store/authStore';
import { Spinner, Modal, PricingModal } from '../components/ui';
import { PRIORITY_CONFIG, CATEGORY_CONFIG } from '../utils/helpers';

const TABS = [
  { id: 'text', label: 'Text', icon: Type, desc: 'Paste raw client feedback' },
  { id: 'url', label: 'Loom / URL', icon: Video, desc: 'Import from Loom video' },
  { id: 'file', label: 'File Upload', icon: Upload, desc: 'Upload docs or screenshots' },
];

function ResultPreview({ result, onDone }) {
  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
        style={{ background: 'var(--success-light)', border: '1px solid rgba(22,163,74,0.2)' }}>
        <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
        <div>
          <p className="font-600 text-sm" style={{ color: 'var(--success)' }}>
            {result.feedback.tasksGenerated} tasks generated successfully!
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)' }}>{result.feedback.summary}</p>
        </div>
      </div>

      {result.feedback.quickWins?.length > 0 && (
        <div className="mb-4 p-4 rounded-xl" style={{ background: 'var(--brand-light)', border: '1px solid var(--brand)/20' }}>
          <p className="text-xs font-700 mb-2" style={{ color: 'var(--brand)' }}>⚡ QUICK WINS</p>
          <ul className="space-y-1">
            {result.feedback.quickWins.map((w, i) => (
              <li key={i} className="text-xs" style={{ color: 'var(--text-2)' }}>• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3 mb-5 max-h-96 overflow-y-auto pr-1">
        {result.tasks.map((task, i) => {
          const pc = PRIORITY_CONFIG[task.priority];
          const cc = CATEGORY_CONFIG[task.category];
          return (
            <div key={task._id || i} className="card p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{cc?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge text-xs ${pc.bg} ${pc.color}`}>{task.priority}</span>
                    <span className={`badge text-xs ${cc?.bg} ${cc?.color}`}>{task.category}</span>
                  </div>
                  <p className="text-sm font-600 mb-1" style={{ color: 'var(--text)' }}>{task.title}</p>
                  <p className="text-xs" style={{ color: 'var(--text-2)' }}>{task.description}</p>
                  {task.suggestion && (
                    <p className="text-xs mt-2 italic" style={{ color: 'var(--text-3)' }}>💡 {task.suggestion}</p>
                  )}
                  {task.tailwindFix && (
                    <pre className="text-xs mt-2 p-2 rounded-lg overflow-x-auto font-mono"
                      style={{ background: 'var(--surface-2)', color: 'var(--brand)' }}>{task.tailwindFix}</pre>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onDone} className="btn btn-primary flex-1 justify-center">
          View in Tasks Board
        </button>
        <button onClick={() => window.location.reload()} className="btn btn-secondary">
          Process More
        </button>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [params] = useSearchParams();
  const [activeTab, setActiveTab] = useState(params.get('tab') || 'text');
  const [textContent, setTextContent] = useState('');
  const [url, setUrl] = useState('');
  const [urlContext, setUrlContext] = useState('');
  const [file, setFile] = useState(null);
  const [taskGroupName, setTaskGroupName] = useState('');
  const [showTaskGroupModal, setShowTaskGroupModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showPricing, setShowPricing] = useState(false);
  const fileRef = useRef();
  const { addTasksFromFeedback } = useTaskStore();
  const { user, refreshUser } = useAuthStore();
  const navigate = useNavigate();

  const canProcess = user?.usage?.feedbackCount < (user?.usage?.limit || 2);

  const getDefaultGroupName = (fileName = '') => {
    const base = fileName.replace(/\.[^.]+$/, '').trim();
    return base ? base.slice(0, 100) : '';
  };

  const handleSubmit = async () => {
    setError('');

    if (activeTab === 'file') {
      if (!file) {
        setError('Please select a file to upload.');
        return;
      }
      if (!taskGroupName.trim()) {
        setShowTaskGroupModal(true);
        return;
      }
    }

    setLoading(true);
    try {
      let response;
      if (activeTab === 'text') {
        if (textContent.trim().length < 10) throw new Error('Please enter at least 10 characters of feedback.');
        response = await api.post('/feedback/text', { content: textContent });
      } else if (activeTab === 'url') {
        if (!url.trim()) throw new Error('Please enter a valid URL.');
        response = await api.post('/feedback/url', { url: url.trim(), additionalContext: urlContext });
      } else {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('taskGroup', taskGroupName.trim());
        response = await api.post('/feedback/file', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setResult(response.data);
      addTasksFromFeedback(response.data.tasks);
      await refreshUser();
      toast.success(`${response.data.feedback.tasksGenerated} tasks created!`);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Processing failed.';
      setError(msg);
      if (err.response?.data?.upgradeRequired) {
        toast.error('Usage limit reached. Upgrade to Pro for more!', { duration: 6000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      setTaskGroupName(getDefaultGroupName(f.name));
      setShowTaskGroupModal(true);
    }
  };

  const handleTaskGroupContinue = () => {
    const clean = taskGroupName.trim();
    if (clean.length < 2) {
      setError('Please enter at least 2 characters for task group name.');
      return;
    }

    setTaskGroupName(clean.slice(0, 100));
    setShowTaskGroupModal(false);
    setTimeout(() => handleSubmit(), 0);
  };

  if (result) return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-700" style={{ color: 'var(--text)' }}>AI Processing Complete</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Your feedback has been converted into actionable tasks.</p>
      </div>
      <div className="card p-6">
        <ResultPreview result={result} onDone={() => navigate('/tasks')} />
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-700" style={{ color: 'var(--text)' }}>Process Feedback</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
          Submit client feedback in any format — AI converts it into structured dev tasks.
        </p>
      </div>

      {!canProcess && (
        <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
          style={{ background: 'var(--warning-light)', border: '1px solid rgba(217,119,6,0.3)' }}>
          <AlertCircle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <div>
            <p className="text-sm font-600" style={{ color: 'var(--warning)' }}>Monthly limit reached</p>
            <p className="text-xs" style={{ color: 'var(--text-2)' }}>
              You've used {user?.usage?.feedbackCount}/{user?.usage?.limit} feedbacks this month.
              <button onClick={() => setShowPricing(true)} className="ml-1 underline font-semibold">Upgrade to Pro</button> for 500/month.
            </p>
          </div>
        </div>
      )}

      {/* Tab selector */}
      <div className="flex gap-2 mb-6">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                activeTab === tab.id
                  ? 'border-[var(--brand)] bg-[var(--brand-light)]'
                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-3)]'
              }`}>
              <Icon size={18} style={{ color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-3)' }} />
              <span className={`text-xs font-600 ${activeTab === tab.id ? 'text-[var(--brand)]' : 'text-[var(--text-2)]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card p-6">
        {/* Text tab */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="label">Client Feedback</label>
              <textarea value={textContent} onChange={e => setTextContent(e.target.value)}
                className="input min-h-48 resize-y"
                placeholder="Paste raw client feedback here...

Example:
'The dashboard is too slow and the buttons are hard to click on mobile. The color scheme feels dated and the form validation errors aren't clear enough. Also, the navigation is confusing — I can never find the export button.'"
              />
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>
                {textContent.length} / 50,000 characters
              </p>
            </div>
          </div>
        )}

        {/* URL tab */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div>
              <label className="label">Loom Video URL or Website URL</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                className="input" placeholder="https://www.loom.com/share/..." />
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-3)' }}>
                Paste a Loom recording link or any URL with feedback context.
              </p>
            </div>
            <div>
              <label className="label">Additional Context <span className="font-normal" style={{ color: 'var(--text-3)' }}>(optional)</span></label>
              <textarea value={urlContext} onChange={e => setUrlContext(e.target.value)}
                className="input min-h-24 resize-y"
                placeholder="Add any extra context about the recording or URL..." />
            </div>
            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'var(--brand-light)', border: '1px solid rgba(58,95,255,0.15)' }}>
              <Video size={15} style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} />
              <p className="text-xs" style={{ color: 'var(--brand)' }}>
                <strong>Loom integration:</strong> Direct transcript extraction requires Loom API access.
                Add context above for best results, or use the Text tab to paste transcripts directly.
              </p>
            </div>
          </div>
        )}

        {/* File tab */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
              style={{
                borderColor: file ? 'var(--brand)' : 'var(--border)',
                background: file ? 'var(--brand-light)' : 'var(--surface-2)'
              }}>
              <input ref={fileRef} type="file" accept=".txt,.pdf,.md,.png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" className="hidden"
                onChange={e => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile || null);
                  setTaskGroupName(selectedFile ? getDefaultGroupName(selectedFile.name) : '');
                  setShowTaskGroupModal(Boolean(selectedFile));
                }} />
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText size={24} style={{ color: 'var(--brand)' }} />
                  <div className="text-left">
                    <p className="font-600 text-sm" style={{ color: 'var(--text)' }}>{file.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setFile(null); setTaskGroupName(''); }}
                    className="ml-2 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40">
                    <X size={14} style={{ color: 'var(--danger)' }} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--text-3)' }} />
                  <p className="font-600 text-sm mb-1" style={{ color: 'var(--text)' }}>Drop file here or click to browse</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Supports .txt, .pdf, .md, .png, .jpg, .jpeg, .svg — max 5MB</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl mt-4"
            style={{ background: 'var(--danger-light)', border: '1px solid rgba(220,38,38,0.2)' }}>
            <AlertCircle size={15} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 1 }} />
            <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading || !canProcess}
          className="btn btn-primary btn-lg w-full justify-center mt-6">
          {loading ? (
            <><Spinner size={18} /> Analyzing with Gemini AI...</>
          ) : (
            <><Zap size={18} /> Process Feedback with AI</>
          )}
        </button>

        {loading && (
          <p className="text-xs text-center mt-3" style={{ color: 'var(--text-3)' }}>
            🤖 Gemini is analyzing your feedback and structuring tasks... (10-30s)
          </p>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-700 mb-2" style={{ color: 'var(--text-2)' }}>💡 TIPS FOR BEST RESULTS</p>
        <ul className="space-y-1">
          {[
            'Be specific — mention exact elements, pages, or flows',
            'Include both problems and desired outcomes',
            'Mention device or browser context if relevant',
            'Longer, detailed feedback generates more granular tasks'
          ].map((tip, i) => (
            <li key={i} className="text-xs" style={{ color: 'var(--text-3)' }}>• {tip}</li>
          ))}
        </ul>
      </div>

      <Modal open={showTaskGroupModal} onClose={() => setShowTaskGroupModal(false)} title="Name This Task Batch" size="md">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-2)' }}>
            Enter a name for this upload so you can filter related tasks later.
          </p>
          <div>
            <label className="label">Task Group Name</label>
            <input
              className="input"
              value={taskGroupName}
              maxLength={100}
              onChange={e => setTaskGroupName(e.target.value)}
              placeholder="Example: Landing Page Review - April"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button className="btn btn-secondary" onClick={() => setShowTaskGroupModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleTaskGroupContinue}>Continue & Process</button>
          </div>
        </div>
      </Modal>

      {/* Pricing Modal */}
      <PricingModal 
        open={showPricing} 
        onClose={() => setShowPricing(false)}
        onSelectPlan={(planId, billingPeriod) => {
          console.log('Selected plan:', planId, 'Billing period:', billingPeriod);
          setShowPricing(false);
        }}
      />
    </div>
  );
}
