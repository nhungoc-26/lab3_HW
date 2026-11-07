
import { useState, type CSSProperties, type ReactNode } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  ariaLabel: string;
  className?: string;
}

export default function VirtualList<T>({
  items,
  itemHeight,
  height,
  getKey,
  renderItem,
  overscan = 3,
  ariaLabel,
  className,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan,
  );

  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan,
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const topSpacerStyle: CSSProperties = {
    height: startIndex * itemHeight,
  };

  const bottomSpacerStyle: CSSProperties = {
    height: Math.max(0, (items.length - endIndex) * itemHeight),
  };

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={className}
      style={{
        height,
        overflowY: "auto",
        overflowX: "hidden",
      }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div style={topSpacerStyle} aria-hidden="true" />

      {visibleItems.map((item, index) => (
        <div
          role="listitem"
          key={getKey(item)}
          style={{ height: itemHeight, overflow: "hidden" }}
        >
          {renderItem(item, startIndex + index)}
        </div>
      ))}

      <div style={bottomSpacerStyle} aria-hidden="true" />
    </div>
  );
}
