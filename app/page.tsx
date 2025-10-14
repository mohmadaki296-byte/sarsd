import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, List } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">نظام إدارة وثائق النقل</h1>
            <p className="text-xl text-slate-600">إدارة وثائق الشحن والنقل بكفاءة واحترافية</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">وثيقة جديدة</CardTitle>
                </div>
                <CardDescription className="text-base">إنشاء وثيقة نقل جديدة</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/documents/new">
                  <Button className="w-full" size="lg">
                    إضافة وثيقة
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-2 border-slate-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <List className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">الوثائق</CardTitle>
                </div>
                <CardDescription className="text-base">عرض جميع الوثائق المحفوظة</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/documents">
                  <Button variant="outline" className="w-full bg-transparent" size="lg">
                    عرض الوثائق
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">إدارة سهلة</h3>
              <p className="text-slate-600 text-sm">إضافة وتعديل الوثائق بسهولة</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">تصدير PDF</h3>
              <p className="text-slate-600 text-sm">تحميل الوثائق بصيغة PDF</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">حفظ آمن</h3>
              <p className="text-slate-600 text-sm">تخزين آمن لجميع البيانات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
