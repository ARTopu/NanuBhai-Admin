import React, { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
}

const Table = ({ children, className }: TableProps) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader = ({ children, className }: TableHeaderProps) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody = ({ children, className }: TableBodyProps) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow = ({ children, className }: TableRowProps) => {
  return <tr className={className}>{children}</tr>;
};

const TableCell = ({ children, isHeader = false, className = '', colSpan }: TableCellProps) => {
  const Element = isHeader ? 'th' : 'td';
  return <Element className={className} colSpan={colSpan}>{children}</Element>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
