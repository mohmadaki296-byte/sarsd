import { DocumentForm } from "@/components/document-form"

export default function NewDocumentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">وثيقة نقل جديدة</h1>
            <p className="text-slate-600">املأ جميع البيانات المطلوبة لإنشاء وثيقة نقل جديدة</p>
          </div>
          <DocumentForm />
        </div>
      </div>
    </div>
  )
}
