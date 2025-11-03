"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link href={href}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </Link>
    </div>
  );
}

