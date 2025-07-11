export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-fox-light-gray">
      <div className="w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}