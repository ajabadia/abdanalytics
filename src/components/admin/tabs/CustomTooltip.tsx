'use client';

import React from 'react';

export interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-card border border-border backdrop-blur-md rounded-none text-[10px] font-mono select-none pointer-events-none z-20">
        <p className="font-bold text-primary mb-1 uppercase tracking-widest">{label}</p>
        {payload.map((item, index) => {
          let valueString = String(item.value);
          if (typeof item.value === 'number' && item.value > 100000000) {
            valueString = `${(item.value / 1024 / 1024 / 1024).toFixed(2)} GB`;
          }
          const colorClass = 
            index === 0 ? 'text-[#0ea5e9]' :
            index === 1 ? 'text-[#10b981]' :
            index === 2 ? 'text-[#f59e0b]' :
            index === 3 ? 'text-[#ef4444]' : 'text-[#8b5cf6]';
          return (
            <p key={index} className={`tracking-tight uppercase ${colorClass}`}>
              {item.name ? `${item.name}: ` : ''}
              {valueString}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};
