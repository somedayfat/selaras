"use client";

import React from "react";

type Props = {
  sectors: string[];
};

export default function SectorMarquee({ sectors }: Props) {
  return (
    <section style={{ background: '#ffffff', padding: '48px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', marginBottom: '24px', textAlign: 'center' }}>
        <span style={{ color: '#d4870a', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '11px' }}>
          Sektor Yang Kami Layani
        </span>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginTop: '6px', letterSpacing: '-0.5px' }}>
          Melayani Berbagai Sektor Industri
        </h2>
      </div>

      {/* Marquee Track Container */}
      <div className="sector-marquee-wrapper">
        <div className="sector-marquee-track">
          {[...sectors, ...sectors, ...sectors, ...sectors].map((sector, index) => (
            <div key={index} className="sector-marquee-card">
              <span className="sector-dot" />
              <span className="sector-name">{sector}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sector-marquee-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 10px 0;
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }

        .sector-marquee-track {
          display: flex !important;
          flex-direction: row !important;
          gap: 14px !important;
          width: max-content !important;
          animation: marqueeScroll 35s linear infinite !important;
          will-change: transform;
        }

        .sector-marquee-track:hover {
          animation-play-state: paused !important;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .sector-marquee-card {
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 9999px !important;
          padding: 10px 22px !important;
          white-space: nowrap !important;
          flex-shrink: 0 !important;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04) !important;
          transition: all 0.25s ease !important;
          cursor: pointer;
        }

        .sector-marquee-card:hover {
          border-color: #02376c !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(2, 55, 108, 0.12) !important;
        }

        .sector-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #d4870a;
          flex-shrink: 0;
        }

        .sector-name {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
        }

        .sector-marquee-card:hover .sector-name {
          color: #02376c;
        }
      `}</style>
    </section>
  );
}
