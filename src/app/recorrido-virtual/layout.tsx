type VirtualTourLayoutProps = {
  children: React.ReactNode;
};

export default function VirtualTourLayout({ children }: VirtualTourLayoutProps) {
  return <div className="min-h-screen bg-black">{children}</div>;
}
