import { buildQrMatrix } from '@/lib/qrMatrix';

interface MockQrCodeProps {
  value: string;
  size?: number;
  label?: string;
}

export const MockQrCode = ({ value, size = 180, label = 'QR check-in simulasi' }: MockQrCodeProps) => {
  const matrix = buildQrMatrix(value);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-2 -2 29 29"
      role="img"
      aria-label={label}
      className="rounded-md bg-white"
    >
      <rect x="-2" y="-2" width="29" height="29" fill="#FFFFFF" />
      {matrix.map((row, rowIndex) =>
        row.map((filled, colIndex) =>
          filled ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex}
              y={rowIndex}
              width={1}
              height={1}
              fill="#0F172A"
            />
          ) : null
        )
      )}
    </svg>
  );
};