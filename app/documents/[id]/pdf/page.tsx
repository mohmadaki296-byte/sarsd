import { db } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";

/**
 * Renders an HTML layout that mirrors the provided PDF exactly in structure, labels, and RTL styling.
 * Notes:
 * - Uses table-based blocks and bordered sections for print fidelity.
 * - A4 page size with narrow margins, background removed for print.
 * - Arabic labels retained exactly; fallback values are empty strings.
 */
export default async function PDFPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const docRef = doc(db, "shipping_documents", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) notFound();

  const document = { id: docSnap.id, ...docSnap.data() } as ShippingDocument;
  const cargoItems = (document.cargo_items as CargoItem[]) || [];

  const yesNo = (v?: boolean) => (v ? "نعم" : v === false ? "لا" : "");
  const val = (v: unknown) => (v === null || v === undefined ? "" : String(v));

  return (
    <html dir="rtl" lang="ar">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>وثيقة نقل - {val(document.document_number)}</title>
        <style>{`
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          html, body { height: 100%; }
          body {
            font-family: system-ui, -apple-system, Segoe UI, Roboto, "Noto Kufi Arabic", "Noto Naskh Arabic", Arial, sans-serif;
            font-size: 11pt; line-height: 1.5; color: #000; background: #fff; direction: rtl;
          }
          .page { width: 100%; max-width: 210mm; margin: 0 auto; }
          .block { border: 1.5px solid #000; margin-bottom: 8px; }
          .block-header { background: #e6e6e6; padding: 6px 10px; font-weight: 700; border-bottom: 1.5px solid #000; }
          .block-body { padding: 8px 10px; }
          .muted { color: #444; }
          .row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .field { display: grid; grid-template-columns: 140px 1fr; align-items: start; column-gap: 8px; padding: 2px 0; }
          .label { font-weight: 700; }
          .value { overflow-wrap: anywhere; }
          .header { text-align: center; border: 2px solid #000; padding: 10px; background: #f5f5f5; margin-bottom: 8px; }
          .title { font-size: 18pt; font-weight: 800; margin-bottom: 6px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; font-size: 10pt; }
          table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
          th, td { border: 1px solid #000; padding: 6px 6px; text-align: right; vertical-align: top; }
          th { background: #e6e6e6; font-weight: 700; }
          .center { text-align: center; }
          .footer { margin-top: 10px; text-align: center; font-size: 9pt; color: #333; border-top: 1px solid #999; padding-top: 8px; }
          .page-number { margin-top: 4px; font-size: 9pt; text-align: left; }
          .tight { margin-bottom: 6px; }
          @media print { .page { padding: 0; } .no-print { display: none; } }
        `}</style>
      </head>
      <body>
        <div className="page">
          {/* Header (مطابق لترتيب الـ PDF) */}
          <div className="header">
            <div className="title">وثيقة نقل</div>
            <div className="meta">
              <div>رقم الوثيقة: {val(document.document_number)}</div>
              <div>رقم الترخيص: {val(document.license_number)}</div>
            </div>
          </div>

          {/* بيانات الناقل */}
          <section className="block">
            <div className="block-header">بيانات الناقل</div>
            <div className="block-body">
              <div className="row">
                <div>
                  <div className="field">
                    <div className="label">الإسم:</div>
                    <div className="value">{val(document.carrier_name)}</div>
                  </div>
                  <div className="field">
                    <div className="label">رقم الهاتف:</div>
                    <div className="value">{val(document.carrier_phone)}</div>
                  </div>
                  {document.carrier_notes && (
                    <div className="field">
                      <div className="label">ملاحظات الناقل:</div>
                      <div className="value">{val(document.carrier_notes)}</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="field">
                    <div className="label">تاريخ الاستلام:</div>
                    <div className="value">{val(document.receipt_date)}</div>
                  </div>
                  <div className="field">
                    <div className="label">الحالة:</div>
                    <div className="value">{val(document.status)}</div>
                  </div>
                  {document.departure_date && (
                    <div className="field">
                      <div className="label">تاريخ الخروج:</div>
                      <div className="value">
                        {val(document.departure_date)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* بيانات السائق & بيانات الشاحنة */}
          <div className="row">
            <section className="block">
              <div className="block-header">بيانات السائق</div>
              <div className="block-body">
                <div className="field">
                  <div className="label">اسم السائق:</div>
                  <div className="value">{val(document.driver_name)}</div>
                </div>
                <div className="field">
                  <div className="label">رقم هوية السائق:</div>
                  <div className="value">{val(document.driver_id_number)}</div>
                </div>
                <div className="field">
                  <div className="label">نوع الهوية:</div>
                  <div className="value">{val(document.driver_id_type)}</div>
                </div>
                <div className="field">
                  <div className="label">الجنسية:</div>
                  <div className="value">
                    {val(document.driver_nationality)}
                  </div>
                </div>
                <div className="field">
                  <div className="label">تاريخ ميلاد السائق:</div>
                  <div className="value">{val(document.driver_birth_date)}</div>
                </div>
                <div className="field">
                  <div className="label">رقم جوال السائق:</div>
                  <div className="value">{val(document.driver_phone)}</div>
                </div>
              </div>
            </section>

            <section className="block">
              <div className="block-header">بيانات الشاحنة</div>
              <div className="block-body">
                <div className="row-3 tight">
                  <div className="field">
                    <div className="label">الدولة</div>
                    <div className="value">{val(document.truck_country)}</div>
                  </div>
                  <div className="field">
                    <div className="label">المدينة</div>
                    <div className="value">{val(document.truck_city)}</div>
                  </div>
                  <div className="field">
                    <div className="label">رقم اللوحة</div>
                    <div className="value">
                      {val(document.truck_plate_number)}
                    </div>
                  </div>
                </div>
                <div className="row-3 tight">
                  <div className="field">
                    <div className="label">ترميز اللوحة</div>
                    <div className="value">
                      {val(document.truck_plate_code)}
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">رمز مجموعة التصنيف</div>
                    <div className="value">
                      {val(document.truck_classification_code)}
                    </div>
                  </div>
                  <div className="field">
                    <div className="label">اللون</div>
                    <div className="value">{val(document.truck_color)}</div>
                  </div>
                </div>
                <div className="row-3">
                  <div className="field">
                    <div className="label">نوع المركبة</div>
                    <div className="value">{val(document.truck_type)}</div>
                  </div>
                  <div className="field">
                    <div className="label">عدد المحاور</div>
                    <div className="value">{val(document.truck_axles)}</div>
                  </div>
                  <div className="field">
                    <div className="label">قدرة المحرك</div>
                    <div className="value">
                      {val(document.truck_engine_power)}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* خط سير الرحلة */}
          <section className="block">
            <div className="block-header">خط سير الرحلة</div>
            <div className="block-body center">
              من {val(document.route_from_city)} ,{" "}
              {val(document.route_from_country)} إلى{" "}
              {val(document.route_to_city)} , {val(document.route_to_country)}
            </div>
          </section>

          {/* المرسل و المرسل إليه */}
          <div className="row">
            <section className="block">
              <div className="block-header">بيانات المرسل</div>
              <div className="block-body">
                <div className="field">
                  <div className="label">الإسم:</div>
                  <div className="value">{val(document.sender_name)}</div>
                </div>
                <div className="field">
                  <div className="label">العنوان:</div>
                  <div className="value">{val(document.sender_address)}</div>
                </div>
                <div className="field">
                  <div className="label">المدينة:</div>
                  <div className="value">{val(document.sender_city)}</div>
                </div>
                <div className="field">
                  <div className="label">الدولة:</div>
                  <div className="value">{val(document.sender_country)}</div>
                </div>
                <div className="field">
                  <div className="label">رقم الهاتف:</div>
                  <div className="value">{val(document.sender_phone)}</div>
                </div>
                {document.sender_notes && (
                  <div className="field">
                    <div className="label">ملاحظات المرسل:</div>
                    <div className="value">{val(document.sender_notes)}</div>
                  </div>
                )}
              </div>
            </section>

            <section className="block">
              <div className="block-header">بيانات المرسل إليه</div>
              <div className="block-body">
                <div className="field">
                  <div className="label">الإسم:</div>
                  <div className="value">{val(document.recipient_name)}</div>
                </div>
                <div className="field">
                  <div className="label">العنوان:</div>
                  <div className="value">{val(document.recipient_address)}</div>
                </div>
                <div className="field">
                  <div className="label">المدينة:</div>
                  <div className="value">{val(document.recipient_city)}</div>
                </div>
                <div className="field">
                  <div className="label">الدولة:</div>
                  <div className="value">{val(document.recipient_country)}</div>
                </div>
                <div className="field">
                  <div className="label">رقم الهاتف:</div>
                  <div className="value">{val(document.recipient_phone)}</div>
                </div>
                {document.recipient_notes && (
                  <div className="field">
                    <div className="label">ملاحظات المرسل إليه:</div>
                    <div className="value">{val(document.recipient_notes)}</div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* بيانات البضاعة */}
          <section className="block">
            <div className="block-header">بيانات البضاعة</div>
            <div className="block-body">
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
                    {cargoItems.map((item, i) => (
                      <tr key={i}>
                        <td>{val(item.description)}</td>
                        <td>{val(item.quantity)}</td>
                        <td>{val(item.weight)}</td>
                        <td>{val(item.unit)}</td>
                        <td>{val(item.dimensions)}</td>
                        <td>{val(item.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="muted">لا توجد بيانات بضاعة</div>
              )}
            </div>
          </section>

          {/* أجور النقل */}
          <section className="block">
            <div className="block-header">بيانات أجور النقل</div>
            <div className="block-body">
              <div className="row">
                <div className="field">
                  <div className="label">تدفع من قبل:</div>
                  <div className="value">{val(document.payment_by)}</div>
                </div>
                <div className="field">
                  <div className="label">طريقة دفع الأجور:</div>
                  <div className="value">{val(document.payment_method)}</div>
                </div>
              </div>
              {document.payment_instructions && (
                <div className="field" style={{ marginTop: 6 }}>
                  <div className="label">تعليمات خاصة بدفع الأجور:</div>
                  <div className="value">
                    {val(document.payment_instructions)}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* وثيقة بيان حمولة */}
          {(document.cargo_document_number ||
            typeof document.is_negotiable !== "undefined") && (
            <section className="block">
              <div className="block-header">وثيقة بيان حمولة</div>
              <div className="block-body row">
                <div className="field">
                  <div className="label">رقم الوثيقة:</div>
                  <div className="value">
                    {val(document.cargo_document_number)}
                  </div>
                </div>
                <div className="field">
                  <div className="label">قابلة للتداول:</div>
                  <div className="value">{yesNo(document.is_negotiable)}</div>
                </div>
              </div>
            </section>
          )}

          <div className="footer">دون أدنى مسؤولية على محتويات الوثيقة</div>
          <div className="page-number">الصفحة 1 من 1</div>
        </div>
      </body>
    </html>
  );
}
