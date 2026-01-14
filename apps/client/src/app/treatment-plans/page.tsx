'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// We'll load the PDF components dynamically on mount
type PDFComponents = {
  PDFDownloadLink: typeof import('@react-pdf/renderer').PDFDownloadLink;
  PDFViewer: typeof import('@react-pdf/renderer').PDFViewer;
  Document: React.ComponentType;
};

function usePDFComponents() {
  const [components, setComponents] = useState<PDFComponents | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComponents() {
      try {
        const [pdfRenderer, docModule] = await Promise.all([
          import('@react-pdf/renderer'),
          import('@/components/pdf/AnxiousAttachmentPlan'),
        ]);
        setComponents({
          PDFDownloadLink: pdfRenderer.PDFDownloadLink,
          PDFViewer: pdfRenderer.PDFViewer,
          Document: docModule.default,
        });
      } catch (error) {
        console.error('Failed to load PDF components:', error);
      } finally {
        setLoading(false);
      }
    }
    loadComponents();
  }, []);

  return { components, loading };
}

export default function TreatmentPlansPage() {
  const [showPreview, setShowPreview] = useState(false);
  const { components, loading: pdfLoading } = usePDFComponents();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-brand-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/" className="text-cream-100 hover:text-white text-sm mb-2 inline-block">
            &larr; Back to T21
          </Link>
          <h1 className="text-3xl font-bold font-poppins">Treatment Plans</h1>
          <p className="text-cream-100 mt-2">Professional clinician resources for the T21 Attachment Healing Program</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Treatment Plan Card */}
        <div className="bg-white border border-cream-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                  Clinician Guide
                </span>
                <h2 className="text-2xl font-bold font-poppins mt-3">
                  21-Day Anxious Attachment Treatment Plan
                </h2>
                <p className="text-cream-100 mt-2 max-w-2xl">
                  Comprehensive intensive protocol integrating AFT, EMDR, IFS, Somatic Experiencing, and DBT skills for healing anxious attachment patterns.
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-cream-50 rounded-xl p-5">
                <div className="text-brand-600 text-2xl font-bold font-poppins">21</div>
                <div className="text-sm text-brand-700 font-medium">Days Intensive</div>
                <p className="text-xs text-muted mt-1">Daily therapeutic sessions with structured progression</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-5">
                <div className="text-brand-600 text-2xl font-bold font-poppins">5</div>
                <div className="text-sm text-brand-700 font-medium">Modalities</div>
                <p className="text-xs text-muted mt-1">AFT, EMDR, IFS, Somatic, DBT</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-5">
                <div className="text-brand-600 text-2xl font-bold font-poppins">4</div>
                <div className="text-sm text-brand-700 font-medium">SMART Goals</div>
                <p className="text-xs text-muted mt-1">Measurable outcomes with assessment checkpoints</p>
              </div>
            </div>

            {/* Protocol Overview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold font-poppins text-brand-700 mb-4">Protocol Overview</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                  <div>
                    <div className="font-medium text-brand-700">Week 1: Foundation & Stabilization</div>
                    <p className="text-sm text-muted">Assessment, psychoeducation, self-soothing toolkit, nervous system regulation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                  <div>
                    <div className="font-medium text-brand-700">Week 2: Processing & Restructuring</div>
                    <p className="text-sm text-muted">EMDR trauma processing, IFS parts work, cognitive restructuring of core beliefs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                  <div>
                    <div className="font-medium text-brand-700">Week 3: Integration & Sustainability</div>
                    <p className="text-sm text-muted">Secure self-attachment, interpersonal skills, relapse prevention, aftercare</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 items-center">
              {pdfLoading ? (
                <div className="inline-flex items-center gap-2 bg-brand-700 text-white px-6 py-3 rounded-xl font-medium opacity-70">
                  Loading PDF...
                </div>
              ) : components ? (
                <components.PDFDownloadLink
                  document={<components.Document />}
                  fileName="T21-Anxious-Attachment-21Day-Plan.pdf"
                  className="inline-flex items-center gap-2 bg-brand-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-600 transition-colors"
                >
                  {({ loading }: { loading: boolean }) => (
                    loading ? 'Generating PDF...' : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </>
                    )
                  )}
                </components.PDFDownloadLink>
              ) : (
                <div className="text-red-600">Failed to load PDF components</div>
              )}

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 border border-brand-200 text-brand-700 px-6 py-3 rounded-xl font-medium hover:bg-cream-50 transition-colors"
                disabled={pdfLoading || !components}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {showPreview ? 'Hide Preview' : 'Preview PDF'}
              </button>
            </div>

            {/* PDF Preview */}
            {showPreview && components && (
              <div className="mt-8">
                <div className="border border-cream-200 rounded-xl overflow-hidden">
                  <components.PDFViewer width="100%" height={700} showToolbar={false}>
                    <components.Document />
                  </components.PDFViewer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-cream-50 rounded-xl p-6 border border-cream-200">
          <h4 className="font-semibold text-brand-700 mb-2">Professional Use Only</h4>
          <p className="text-sm text-muted">
            This treatment plan is designed for use by licensed mental health professionals (psychologists, psychiatrists, LCSWs, LMFTs, LPCs).
            It provides a structured protocol framework that should be adapted based on individual patient needs, clinical judgment,
            and evidence-based practice guidelines.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-cream-50 border-t border-cream-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted">
          <p>T21 Attachment Healing Program</p>
          <p className="mt-1">Evidence-based interventions for secure attachment development</p>
        </div>
      </footer>
    </div>
  );
}
