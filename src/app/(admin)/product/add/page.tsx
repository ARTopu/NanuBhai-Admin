import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AddProduct from "@/components/product/AddProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product | TailAdmin - Next.js Dashboard Template",
  description: "This is Add Product page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AddProductPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add Product" />
      <div className="space-y-6">
        <AddProduct />
      </div>
    </div>
  );
}