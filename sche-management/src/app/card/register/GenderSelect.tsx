"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GenderSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Chọn giới tính" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="male">Nam</SelectItem>
        <SelectItem value="female">Nữ</SelectItem>
      </SelectContent>
    </Select>
  );
}


