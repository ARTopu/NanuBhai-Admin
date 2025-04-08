import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SubCategories from "@/components/product/SubCategories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Sub-Categories | NanuBhai - Next.js Dashboard Template",
  description: "This is Product Sub-Categories page for NanuBhai - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function SubCategoriesPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Sub-Categories" />
      <div className="space-y-6">
        <SubCategories />
      </div>
    </div>
  );
}