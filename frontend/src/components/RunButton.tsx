"use client";

import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface RunButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function RunButton({ onClick, loading }: RunButtonProps) {
  return (
    <Button onClick={onClick} disabled={loading} className="cursor-pointer bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded">
      {loading ? "Running" : <><Play /> Run</>}
    </Button>
  );
}
