import { db } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const docRef = doc(db, "shipping_documents", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const document = { id: docSnap.id, ...docSnap.data() } as ShippingDocument;
  const cargoItems = (document.cargo_items as CargoItem[]) || [];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/documents">
            <Button variant="ghost" size="sm" className="text-blue-600">
              إغلاق
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-gray-400">
            bayan.logisti.sa
          </h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5" />
            </Button>
            <Link href={`/documents/${id}/pdf`} target="_blank">
              <Button variant="ghost" size="icon">
                <Download className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          وثيقة نقل
        </h2>

        {/* Document Details Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            تفاصيل وثيقة نقل
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">رقم الوثيقة</span>
              <span className="text-gray-900 font-medium">
                {document.document_number}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">الحالة</span>
              <span className="text-gray-900 font-medium">
                {document.status || "معلقة"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">تاريخ الإصدار</span>
              <span className="text-gray-900 font-medium">
                {document.receipt_date || "لم يحدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">تاريخ الاستلام</span>
              <span className="text-gray-900 font-medium">
                {document.receipt_date || "لم يحدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">
                تاريخ التسليم المتوقع
              </span>
              <span className="text-gray-900 font-medium">
                {document.exit_date || "لم يحدد"}
              </span>
            </div>

            <div className="py-3">
              <span className="text-gray-500 text-sm block mb-2">
                ملاحظات الوثيقة
              </span>
              <div className="bg-gray-50 rounded p-3 min-h-[80px] text-gray-900">
                {document.carrier_notes || ""}
              </div>
            </div>
          </div>
        </div>

        {/* Carrier Details Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            تفاصيل الناقل
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">اسم الناقل</span>
              <span className="text-gray-900 font-medium">
                {document.carrier_name || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">رقم الترخيص</span>
              <span className="text-gray-900 font-medium">
                {document.license_number || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">الهاتف</span>
              <span className="text-gray-900 font-medium">
                {document.carrier_phone || "غير محدد"}
              </span>
            </div>

            <div className="py-3">
              <span className="text-gray-500 text-sm block mb-2">
                البريد الإلكتروني
              </span>
              <span className="text-gray-900 font-medium">
                {document.carrier_email || "غير محدد"}
              </span>
            </div>
          </div>

          {/* Cargo Table */}
          {cargoItems.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                عرض بيانات الحمولة
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 text-gray-600 ">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-center text-sm font-medium">
                        الرقم
                      </th>
                      <th className="border border-gray-300 p-3 text-center text-sm font-medium">
                        المرسل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargoItems.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-3 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-3 text-center">
                          {document.sender_name || "غير محدد"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Details Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            تفاصيل المركبة
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">الدولة</span>
              <span className="text-gray-900 font-medium">
                {document.truck_country || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">المدينة</span>
              <span className="text-gray-900 font-medium">
                {document.truck_city || "-"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">رقم اللوحة</span>
              <span className="text-gray-900 font-medium">
                {document.truck_plate_number || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">ترميز اللوحة</span>
              <span className="text-gray-900 font-medium">
                {document.truck_plate_code || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">رمز مجموعة التصنيف</span>
              <span className="text-gray-900 font-medium">
                {document.truck_type || "غير محدد"}
              </span>
            </div>

            <div className="py-3">
              <span className="text-gray-500 text-sm block mb-2">اللون</span>
              <span className="text-gray-900 font-medium">
                {document.truck_color || "غير محدد"}
              </span>
            </div>
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            بيانات السائقين
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">رقم هوية السائق</span>
              <span className="text-gray-900 font-medium">
                {document.driver_id_number || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">
                اسم السائق، عائلة، عربي
              </span>
              <span className="text-gray-900 font-medium">
                {document.driver_name || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">نوع الهوية</span>
              <span className="text-gray-900 font-medium">
                {document.driver_id_type || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">الجنسية</span>
              <span className="text-gray-900 font-medium">
                {document.driver_nationality || "غير محدد"}
              </span>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">تاريخ ميلاد السائق</span>
              <span className="text-gray-900 font-medium">
                {document.driver_birth_date || "غير محدد"}
              </span>
            </div>

            <div className="py-3">
              <span className="text-gray-500 text-sm block mb-2">
                رقم جوال السائق
              </span>
              <span className="text-gray-900 font-medium">
                {document.driver_phone || "غير محدد"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 py-6">
          بوابة النقل والخدمات اللوجستية © جميع الحقوق محفوظة 2024
        </div>
      </div>
    </div>
  );
}
