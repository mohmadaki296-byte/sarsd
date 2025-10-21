"use client";

import html2pdf from "html2pdf.js";
import { useCallback, useRef, useState } from "react";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";

function fmt(v: unknown, alt = "") {
  return v === undefined || v === null || v === "" ? alt : String(v);
}

export default function PdfClient({
  document,
  cargoItems,
  docUrl,
}: {
  document: ShippingDocument;
  cargoItems: CargoItem[];
  docUrl: string;
}) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!sheetRef.current || downloading) return;
    setDownloading(true);
    try {
      // Ensure fonts/images are ready before render
      // @ts-ignore
      if (document.fonts?.ready) await (document as any).fonts.ready;
      const images = sheetRef.current.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise((res) => {
              if (img.complete) return res(null);
              img.addEventListener("load", () => res(null));
              img.addEventListener("error", () => res(null));
            })
        )
      );

      const opt: any = {
        margin: [10, 10, 10, 10], // mm
        filename: `shipping-${fmt(document.document_number, document.id)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(sheetRef.current).save();
    } finally {
      setDownloading(false);
    }
  }, [downloading, document]);

  return (
    <div dir="rtl" lang="ar">
      <style jsx global>{`
        :root {
          --brand: #0b6a88;
          --brand2: #0f8aa8;
          --border: #cfd9df;
          --text: #222;
          --muted: #5b7280;
          --bg: #fff;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: system-ui, -apple-system, Segoe UI, Roboto,
            "Noto Kufi Arabic", "Noto Naskh Arabic", Tahoma, Arial, sans-serif;
          line-height: 1.8;
        }
        .sheet {
          width: 100%;
          margin: 0 auto;
          padding: 0 8px 32px;
          background: #fff;
        }
        .page {
          padding: 16px 16px 32px;
        }
        .doc-title {
          text-align: center;
          color: var(--brand);
          font-weight: 800;
          font-size: clamp(20px, 3.2vw, 28px);
          margin: 20px 0 8px;
        }
        .topline {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 16px;
          align-items: start;
          margin-bottom: 16px;
          position: relative;
        }
        .qr {
          width: 120px;
          height: 120px;
          border: 2px solid var(--border);
          display: grid;
          place-items: center;
          font-size: 12px;
          color: var(--muted);
          position: absolute;
          top: 9px;
          left: 12px;
        }
        .summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
        }
        .kv {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4px 8px;
        }
        .kv .k {
          color: #000;
          font-weight: 700;
        }
        .kv .v {
          color: #000;
        }
        .section {
          border: 1px solid var(--brand);
          border-radius: 6px;
          overflow: hidden;
          margin-top: 16px;
        }
        .section > .head {
          background: var(--brand);
          color: #fff;
          padding: 10px 12px;
          font-weight: 800;
          border-bottom: 2px solid var(--brand2);
        }
        .section > .body {
          padding: 12px;
          background: #fff;
        }
        .twocol {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 1px solid var(--border);
        }
        .cell {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 10px 12px;
          border-bottom: 1px solid var(--border);
        }
        .cell:nth-child(odd) {
          border-inline-end: 1px solid var(--border);
        }
        .cell .label {
          color: var(--muted);
        }
        .cell .value {
          text-align: start;
          font-weight: 700;
        }
        .table-wrap {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid var(--brand);
          border-radius: 6px;
        }
        table {
          min-width: 720px;
          width: 100%;
          border-collapse: collapse;
          background: #fff;
        }
        thead th {
          background: var(--brand);
          color: #fff;
          padding: 10px 12px;
          font-weight: 800;
          border-inline: 1px solid var(--brand2);
        }
        tbody td {
          border-top: 1px solid var(--border);
          padding: 10px 12px;
        }
        .footer {
          margin-top: 24px;
          color: var(--muted);
          font-size: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .print-btn {
          position: fixed;
          inset-inline-end: 16px;
          inset-block-end: 16px;
          border: none;
          background: var(--brand);
          color: #fff;
          font-weight: 700;
          padding: 10px 14px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(11, 106, 136, 0.25);
        }
        @media (max-width: 840px) {
          .topline {
            grid-template-columns: 1fr;
          }
          .qr {
            position: static;
            justify-self: center;
          }
          .summary {
            grid-template-columns: 1fr 1fr;
          }
          .twocol {
            grid-template-columns: 1fr;
          }
          .cell {
            grid-template-columns: 1fr 1fr;
          }
        }
        @page {
          size: A4;
          margin: 10mm;
        }
        @media print {
          .sheet {
            border: none;
          }
          .print-btn {
            display: none !important;
          }
        }
      `}</style>
      <section className="sheet" ref={sheetRef} dir="rtl">
        <img src="/lojfds.png" alt="" style={{ marginTop: 50 }} />
        <img
          src={
            "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" +
            encodeURIComponent(new URL(docUrl).href)
          }
          alt="QR"
          style={{ marginRight: "auto" }}
        />
        <div className="page" style={{ zoom: 0.6 }}>
          <div className="doc-title">وثيقة نقل</div>
          <div className="topline">
            <div></div>
            <div className="summary">
              <div className="kv">
                <div className="k">رقم الوثيقة:</div>
                <div className="v">{fmt(document.document_number)}</div>
              </div>
              <div className="kv">
                <div className="k">تاريخ الاستلام:</div>
                <div className="v">{fmt(document.receipt_date, "لم يحدد")}</div>
              </div>
              <div className="kv">
                <div className="k">الحالة:</div>
                <div className="v">{fmt(document.status)}</div>
              </div>
              <div className="kv">
                <div className="k">تاريخ الخروج:</div>
                <div className="v">
                  {fmt(document.departure_date, "لم يحدد")}
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="head">بيانات الناقل:</div>
            <div className="body">
              <div className="kv">
                <div className="k">الاسم:</div>
                <div className="v">{fmt(document.carrier_name)}</div>
              </div>
              {document.carrier_notes && (
                <div className="kv" style={{ marginTop: 8 }}>
                  <div className="k">ملاحظات:</div>
                  <div className="v">{document.carrier_notes}</div>
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <div className="head">بيانات السائق:</div>
            <div className="body twocol">
              <div className="cell">
                <div className="label">رقم هوية السائق</div>
                <div className="value">{fmt(document.driver_id_number)}</div>
              </div>
              <div className="cell">
                <div className="label">الدولة</div>
                <div className="value">
                  {fmt(document.driver_city || document.driver_nationality)}
                </div>
              </div>
              <div className="cell">
                <div className="label">نوع الهوية</div>
                <div className="value">{fmt(document.driver_id_type)}</div>
              </div>
              <div className="cell">
                <div className="label">المدينة</div>
                <div className="value">{fmt(document.driver_city)}</div>
              </div>
              <div className="cell">
                <div className="label">اسم السائق</div>
                <div className="value">{fmt(document.driver_name)}</div>
              </div>
              <div className="cell">
                <div className="label">تاريخ ميلاد السائق</div>
                <div className="value">{fmt(document.driver_birth_date)}</div>
              </div>
              <div className="cell">
                <div className="label">رقم جوال السائق</div>
                <div className="value">{fmt(document.driver_phone)}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="head">بيانات الشاحنة:</div>
            <div className="body twocol">
              <div className="cell">
                <div className="label">الدولة</div>
                <div className="value">{fmt(document.truck_country)}</div>
              </div>
              <div className="cell">
                <div className="label">المدينة</div>
                <div className="value">{fmt(document.truck_city)}</div>
              </div>
              <div className="cell">
                <div className="label">رقم اللوحة</div>
                <div className="value">{fmt(document.truck_plate_number)}</div>
              </div>
              <div className="cell">
                <div className="label">ترميز اللوحة</div>
                <div className="value">{fmt(document.truck_plate_code)}</div>
              </div>
              <div className="cell">
                <div className="label">رمز مجموعة التصنيف</div>
                <div className="value">
                  {fmt(document.truck_classification_code)}
                </div>
              </div>
              <div className="cell">
                <div className="label">اللون</div>
                <div className="value">{fmt(document.truck_color)}</div>
              </div>
              <div className="cell">
                <div className="label">نوع المركبة</div>
                <div className="value">{fmt(document.truck_type)}</div>
              </div>
            </div>
          </div>

          <div
            className="section"
            style={{ visibility: "hidden", height: "200vh" }}
          >
            <div className="head">بيانات المرسل / المرسل إليه:</div>
            <div className="body twocol">
              <div className="cell">
                <div className="label">اسم المرسل</div>
                <div className="value">{fmt(document.sender_name)}</div>
              </div>
              <div className="cell">
                <div className="label">اسم المرسل إليه</div>
                <div className="value">{fmt(document.recipient_name)}</div>
              </div>
              <div className="cell">
                <div className="label">هاتف المرسل</div>
                <div className="value">{fmt(document.sender_phone)}</div>
              </div>
              <div className="cell">
                <div className="label">هاتف المرسل إليه</div>
                <div className="value">{fmt(document.recipient_phone)}</div>
              </div>
              <div className="cell">
                <div className="label">عنوان المرسل</div>
                <div className="value">
                  {fmt(
                    document.sender_address ||
                      `${fmt(document.sender_city)}، ${fmt(
                        document.sender_country
                      )}`
                  )}
                </div>
              </div>
              <div className="cell">
                <div className="label">عنوان المرسل إليه</div>
                <div className="value">
                  {fmt(
                    document.recipient_address ||
                      `${fmt(document.recipient_city)}، ${fmt(
                        document.recipient_country
                      )}`
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="head">بيانات البضاعة:</div>
            <div className="body">
              <div className="kv" style={{ marginBottom: 8 }}>
                <div className="k">خط سير الرحلة:</div>
                <div className="v">
                  من {fmt(document.route_from_city)}،{" "}
                  {fmt(document.route_from_country)} إلى{" "}
                  {fmt(document.route_to_city)}،{" "}
                  {fmt(document.route_to_country)}
                </div>
              </div>
              {cargoItems.length > 0 ? (
                <div className="table-wrap">
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
                      {cargoItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>{fmt(item.description)}</td>
                          <td>{fmt(item.quantity)}</td>
                          <td>{fmt(item.weight)}</td>
                          <td>{fmt(item.unit)}</td>
                          <td>{fmt(item.dimensions)}</td>
                          <td>{fmt(item.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: "8px 0" }}>لا توجد بيانات بضاعة</div>
              )}
            </div>
          </div>

          <div className="section">
            <div className="head">بيانات أجور النقل:</div>
            <div className="body twocol">
              <div className="cell">
                <div className="label">تدفع من قبل</div>
                <div className="value">{fmt(document.payment_by)}</div>
              </div>
              <div className="cell">
                <div className="label">طريقة دفع الأجور</div>
                <div className="value">{fmt(document.payment_method)}</div>
              </div>
              {document.payment_instructions && (
                <div className="cell" style={{ gridColumn: "1 / -1" }}>
                  <div className="label">تعليمات خاصة بدفع الأجور</div>
                  <div className="value">{document.payment_instructions}</div>
                </div>
              )}
            </div>
          </div>

          {document.cargo_document_number && (
            <div className="section">
              <div className="head">وثيقة بيان حمولة</div>
              <div className="body twocol">
                <div className="cell">
                  <div className="label">رقم الوثيقة</div>
                  <div className="value">{document.cargo_document_number}</div>
                </div>
                <div className="cell">
                  <div className="label">قابلة للتداول</div>
                  <div className="value">
                    {document.is_negotiable ? "نعم" : "لا"}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="footer">
            <div>دون أدنى مسؤولية على محتويات الوثيقة</div>
            <div>
              الصفحة <strong>1</strong> من <strong>1</strong>
            </div>
          </div>
        </div>
      </section>

      <button
        className="print-btn"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? "جارٍ التحويل..." : "تحميل PDF"}
      </button>

      {/* Keep your keyboard print shortcut override (optional) */}
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            "document.addEventListener('keydown', function(e){const isMac=navigator.platform.toUpperCase().includes('MAC');const meta=isMac?e.metaKey:e.ctrlKey;if((meta&&e.key.toLowerCase()==='p')||(!meta&&e.key.toLowerCase()==='p'&&e.altKey)){return;}if(!meta&&e.key.toLowerCase()==='p'&&!e.altKey){e.preventDefault();window.print();}});",
        }}
      />
    </div>
  );
}
