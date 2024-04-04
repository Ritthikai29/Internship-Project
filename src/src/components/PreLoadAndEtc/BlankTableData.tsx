import React from "react";

interface TableLoaderProps {
  column: number;
}

const BlankDaTa: React.FC<TableLoaderProps> = ({ column }) => {
  return (
    <tbody className="bg-white border drop-shadow-lg rounded-lg">
      <tr className="rounded-lg border h-60">
        <td colSpan={column} className="text-center text-2xl text-gray-500">
          <strong className="mr-4">ไม่มีรายการ</strong>
        </td>
      </tr>
    </tbody>
  );
};

export default BlankDaTa;
