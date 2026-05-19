export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#101013] z-50">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-[#6C5CE7] animate-spin" />
    </div>
  );
}