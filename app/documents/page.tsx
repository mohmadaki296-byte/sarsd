import { db } from "@/lib/firestore";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { ProtectedRoute } from "@/components/protected-route";

export const dynamic = "force-dynamic";
async function DocumentsPage() {
  const documentsRef = collection(db, "shipping_documents");
  const q = query(documentsRef, orderBy("created_at", "desc"));
  const querySnapshot = await getDocs(q);

  const documents = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-black"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                الوثائق
              </h1>
              <p className="text-slate-600">جميع وثائق النقل المحفوظة</p>
            </div>
            <Link href="/documents/new">
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                وثيقة جديدة
              </Button>
            </Link>
          </div>

          {!documents || documents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">لا توجد وثائق</h3>
                <p className="text-slate-600 mb-4">
                  ابدأ بإضافة وثيقة نقل جديدة
                </p>
                <Link href="/documents/new">
                  <Button>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة وثيقة
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {documents.map((doc: any) => (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            وثيقة رقم: {doc.document_number}
                          </CardTitle>
                          <div className="flex gap-4 text-sm text-slate-600">
                            <span>الحالة: {doc.status}</span>
                            {doc.receipt_date && (
                              <span>تاريخ الاستلام: {doc.receipt_date}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm text-slate-500">
                            {doc.created_at?.toDate
                              ? new Date(
                                  doc.created_at.toDate()
                                ).toLocaleDateString("ar-SA")
                              : ""}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        {doc.carrier_name && (
                          <div>
                            <span className="font-semibold">الناقل: </span>
                            {doc.carrier_name}
                          </div>
                        )}
                        {doc.driver_name && (
                          <div>
                            <span className="font-semibold">السائق: </span>
                            {doc.driver_name}
                          </div>
                        )}
                        {doc.route_from_city && doc.route_to_city && (
                          <div>
                            <span className="font-semibold">المسار: </span>
                            {doc.route_from_city} ← {doc.route_to_city}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <ProtectedRoute>
      <DocumentsPage />
    </ProtectedRoute>
  );
}
