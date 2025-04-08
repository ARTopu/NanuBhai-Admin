import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductList from "@/components/product/ProductList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product List | TailAdmin - Next.js Dashboard Template",
  description: "This is Product List page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function ProductListPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product List" />
      <div className="space-y-6">
        <ComponentCard title="Products">
          <ProductList />
        </ComponentCard>
      </div>
    </div>
  );
}