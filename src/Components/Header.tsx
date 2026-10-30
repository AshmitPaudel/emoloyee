import { Building2 } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Building2 size={24} />
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          GLOBAL
        </h1>
      </div>
    </header>
  );
}