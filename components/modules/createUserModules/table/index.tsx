import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { table_headers as tableHeaders } from "@/json_data/table_header";
import { FilePenLine, Trash2 } from "lucide-react";

type TTextAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify"
  | "match-parent";

const TableComponent = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
          {tableHeaders.map((header, headerIndex) => (
            <TableHead
              key={headerIndex}
              className={``}
              style={{
                width: header.width,
                textAlign: header.text as TTextAlign,
              }}
            >
              {header.title}
            </TableHead>
          ))}
          <TableHead>
            <span className="sr-only">Logo</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-center">Credit Card</TableCell>
          <TableCell className="text-left">$250.00</TableCell>
          <TableCell>
            <div className="flex gap-2  text-brand-text-customBlue cursor-pointer">
              <span className="flex gap-1 hover:text-black">
                <FilePenLine size={18} /> Edit
              </span>

              <span className="flex gap-1 hover:text-black">
                <Trash2 size={18} /> Delete
              </span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableComponent;
