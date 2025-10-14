import { db } from "@/lib/firebase-client"
import { doc, getDoc } from "firebase/firestore"
import { notFound } from "next/navigation"
import type { ShippingDocument, CargoItem } from "@/types/shipping-document"

export default async function PDFPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const docRef = doc(db, "shipping_documents", id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    notFound()
  }

  const document = { id: docSnap.id, ...docSnap.data() } as ShippingDocument
  const cargoItems = (document.cargo_items as CargoItem[]) || []

  return (
    <html dir="rtl" lang="ar">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>وثيقة نقل - {document.document_number}</title>
        <style>{`
          @page {
            size: A4;
            margin: 15mm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            direction: rtl;
            background: white;
          }
          
          .page {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            border: 2px solid #000;
            padding: 10px;
            margin-bottom: 10px;
            background: #f5f5f5;
          }
          
          .header h1 {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 8px;
          }
          
          .header-info {
            display: flex;
            justify-content: space-between;
            font-size: 10pt;
            margin-top: 8px;
          }
          
          .section {
            border: 1px solid #000;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          
          .section-title {
            background: #e0e0e0;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 11pt;
            border-bottom: 1px solid #000;
          }
          
          .section-content {
            padding: 10px;
          }
          
          .two-columns {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .field {
            margin-bottom: 8px;
            font-size: 10pt;
          }
          
          .field-label {
            font-weight: bold;
            display: inline;
          }
          
          .field-value {
            display: inline;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
            margin-top: 8px;
          }
          
          table th {
            background: #e0e0e0;
            border: 1px solid #000;
            padding: 6px;
            text-align: right;
            font-weight: bold;
          }
          
          table td {
            border: 1px solid #000;
            padding: 6px;
            text-align: right;
          }
          
          .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 9pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 8px;
          }
          
          .page-number {
            text-align: left;
            font-size: 9pt;
            margin-top: 10px;
          }
          
          @media print {
            body {
              background: white;
            }
            .page {
              padding: 0;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="page">
          {/* Header */}
          <div className="header">
            <h1>وثيقة نقل</h1>
            <div className="header-info">
              <div>رقم الوثيقة: {document.document_number || ""}</div>
              <div>رقم الترخيص: {document.license_number || ""}</div>
            </div>
          </div>

          {/* Carrier Info */}
          <div className="section">
            <div className="section-title">بيانات الناقل</div>
            <div className="section-content">
              <div className="two-columns">
                <div>
                  <div className="field">
                    <span className="field-label">الإسم:</span>
                    <span className="field-value">{document.carrier_name || ""}</span>
                  </div>
                  <div className="field">
                    <span className="field-label">رقم الهاتف:</span>
                    <span className="field-value">{document.carrier_phone || ""}</span>
                  </div>
                </div>
                <div>
                  <div className="field">
                    <span className="field-label">تاريخ الاستلام:</span>
                    <span className="field-value">{document.receipt_date || "لم يحدد"}</span>
                  </div>
                  <div className="field">
                    <span className="field-label">الحالة:</span>
                    <span className="field-value">{document.status || ""}</span>
                  </div>
                </div>
              </div>
              {document.carrier_notes && (
                <div className="field" style={{ marginTop: "8px" }}>
                  <span className="field-label">ملاحظات الناقل:</span>
                  <span className="field-value">{document.carrier_notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Driver and Truck Info */}
          <div className="two-columns">
            <div className="section">
              <div className="section-title">بيانات السائق</div>
              <div className="section-content">
                <div className="field">
                  <span className="field-label">اسم السائق:</span>
                  <span className="field-value">{document.driver_name || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم هوية السائق:</span>
                  <span className="field-value">{document.driver_id_number || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">نوع الهوية:</span>
                  <span className="field-value">{document.driver_id_type || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">الجنسية:</span>
                  <span className="field-value">{document.driver_nationality || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">تاريخ ميلاد السائق:</span>
                  <span className="field-value">{document.driver_birth_date || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم جوال السائق:</span>
                  <span className="field-value">{document.driver_phone || ""}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">بيانات الشاحنة</div>
              <div className="section-content">
                <div className="field">
                  <span className="field-label">الدولة:</span>
                  <span className="field-value">{document.truck_country || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">المدينة:</span>
                  <span className="field-value">{document.truck_city || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم اللوحة:</span>
                  <span className="field-value">{document.truck_plate_number || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">ترميز اللوحة:</span>
                  <span className="field-value">{document.truck_plate_code || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رمز مجموعة التصنيف:</span>
                  <span className="field-value">{document.truck_classification_code || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">اللون:</span>
                  <span className="field-value">{document.truck_color || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">{document.truck_type || "تريلا"}:</span>
                  <span className="field-value">{document.truck_plate_number || ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Info */}
          <div className="section">
            <div className="section-title">خط سير الرحلة</div>
            <div className="section-content">
              <div style={{ textAlign: "center", fontWeight: "bold" }}>
                من {document.route_from_city || ""}, {document.route_from_country || ""} الى{" "}
                {document.route_to_city || ""}, {document.route_to_country || ""}
              </div>
            </div>
          </div>

          {/* Sender and Recipient Info */}
          <div className="two-columns">
            <div className="section">
              <div className="section-title">بيانات المرسل</div>
              <div className="section-content">
                <div className="field">
                  <span className="field-label">الإسم:</span>
                  <span className="field-value">{document.sender_name || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">العنوان:</span>
                  <span className="field-value">{document.sender_address || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">المدينة:</span>
                  <span className="field-value">{document.sender_city || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">الدولة:</span>
                  <span className="field-value">{document.sender_country || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم الهاتف:</span>
                  <span className="field-value">{document.sender_phone || ""}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-title">بيانات المرسل إليه</div>
              <div className="section-content">
                <div className="field">
                  <span className="field-label">الإسم:</span>
                  <span className="field-value">{document.recipient_name || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">العنوان:</span>
                  <span className="field-value">{document.recipient_address || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">المدينة:</span>
                  <span className="field-value">{document.recipient_city || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">الدولة:</span>
                  <span className="field-value">{document.recipient_country || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم الهاتف:</span>
                  <span className="field-value">{document.recipient_phone || ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Items */}
          <div className="section">
            <div className="section-title">بيانات البضاعة</div>
            <div className="section-content">
              {cargoItems.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>وصف البضاعة</th>
                      <th>العدد</th>
                      <th>الوزن</th>
                      <th>الوحدة</th>
                      <th>الأبعاد (متر)</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargoItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description || ""}</td>
                        <td>{item.quantity || ""}</td>
                        <td>{item.weight || ""}</td>
                        <td>{item.unit || ""}</td>
                        <td>{item.dimensions || ""}</td>
                        <td>{item.status || ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>لا توجد بيانات بضاعة</p>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="section">
            <div className="section-title">بيانات أجور النقل</div>
            <div className="section-content">
              <div className="two-columns">
                <div className="field">
                  <span className="field-label">تدفع من قبل:</span>
                  <span className="field-value">{document.payment_by || ""}</span>
                </div>
                <div className="field">
                  <span className="field-label">طريقة دفع الأجور:</span>
                  <span className="field-value">{document.payment_method || ""}</span>
                </div>
              </div>
              {document.payment_instructions && (
                <div className="field" style={{ marginTop: "8px" }}>
                  <span className="field-label">تعليمات خاصة بدفع الأجور:</span>
                  <span className="field-value">{document.payment_instructions}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cargo Document Number */}
          {document.cargo_document_number && (
            <div className="section">
              <div className="section-title">وثيقة بيان حمولة</div>
              <div className="section-content">
                <div className="field">
                  <span className="field-label">رقم الوثيقة:</span>
                  <span className="field-value">{document.cargo_document_number}</span>
                </div>
                <div className="field">
                  <span className="field-label">قابلة للتداول:</span>
                  <span className="field-value">{document.is_negotiable ? "نعم" : "لا"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="footer">دون أدنى مسؤولية على محتويات الوثيقة</div>

          <div className="page-number">الصفحة 1 من 1</div>
        </div>
      </body>
    </html>
  )
}
