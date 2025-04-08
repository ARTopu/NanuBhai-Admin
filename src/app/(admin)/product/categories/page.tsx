import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductCategories from "@/components/product/ProductCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Categories | TailAdmin - Next.js Dashboard Template",
  description: "This is Product Categories page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CategoriesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Categories" />
      <div className="space-y-6">
        <ProductCategories />
      </div>
    </div>
  );
}