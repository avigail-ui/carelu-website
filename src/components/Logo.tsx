export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/logo.png"
      alt="Carelu"
      style={{
        height: size,
        width: 'auto',
        display: 'inline-block',
      }}
    />
  );
}
