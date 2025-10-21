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
        margin: [10, 10, 10, 10],
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
          --border: #ccc;
          --text: #000;
          --muted: #666;
          --bg: #fff;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
          direction: rtl;
        }
        body {
          margin: 0;
          background: #f5f5f5;
          color: var(--text);
          font-family: "Almarai", sans-serif;
          line-height: 1;
        }
        .sheet {
          max-width: 260mm;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .page {
          padding: 5mm;
          min-height: 247mm;
          position: relative;
        }
        .page-break {
          page-break-after: always;
          break-after: page;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .logo {
          width: 150px;
          height: auto;
        }
        .qr {
          width: 90px;
          height: 90px;
          border: 1px solid var(--border);
        }
        .doc-title {
          text-align: center;
          font-size: 28px;
          font-weight: 800;
          margin: 20px 0;
          color: var(--brand);
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          margin-bottom: 20px;
          font-size: 9px;
          gap: 10px;
        }
        .info-item {
          display: flex;
          gap: 10px;
        }
        .info-label {
          font-weight: 700;
          font-size: 9px;
        }
        .section {
          border: 1px solid var(--brand2);
          margin-bottom: 15px;
          font-size: 9px;
        }
        .section-title {
          background: var(--brand2);
          color: #fff;
          padding: 8px 12px;
          font-weight: 700;
          font-size: 9px;
        }
        .section-content {
          padding: 12px;
        }
        .grid-2col {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border: none;
          gap: 0;
        }
        .grid-cell {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          font-size: 9px;
        }
        .grid-cell:nth-child(odd) {
          border-left: 0px solid var(--border);
        }
        .grid-cell:last-child,
        .grid-cell:nth-last-child(2):nth-child(odd) {
          border-bottom: none;
        }
        .cell-label {
          color: var(--text);
          font-weight: 700;
          font-size: 9px;
        }
        .cell-value {
          text-align: right;
        }
        .side-by-side {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 15px;
        }
        .box {
          font-size: 9px;
          border: 1px solid var(--brand2);
        }
        .box-title {
          background: var(--brand2);
          color: #fff;
          padding: 8px 12px;
          font-weight: 700;
          font-size: 9px;
        }
        .box-content {
          padding: 12px;
        }
        .field {
          margin-bottom: 8px;
          display: flex;
          gap: 8px;
        }
        .field-label {
          font-weight: 700;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 0px solid var(--border);
          margin: 10px 0;
        }
        thead th {
          background: var(--brand2);
          color: #fff;
          padding: 8px;
          font-weight: 700;
          border: 1px solid var(--border);
          font-size: 9px;
        }
        tbody td {
          border: 1px solid var(--border);
          padding: 8px;
          font-size: 9px;
        }
        .footer {
          position: absolute;
          bottom: 15mm;
          left: 20mm;
          right: 20mm;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--muted);
        }
        .print-btn {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: var(--brand);
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(11, 106, 136, 0.3);
          z-index: 1000;
        }
        .print-btn:hover {
          background: var(--brand2);
        }
        .print-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media print {
          body {
            background: #fff;
          }
          .sheet {
            box-shadow: none;
          }
          .print-btn {
            display: none !important;
          }
        }
      `}</style>

      <section className="sheet" ref={sheetRef}>
        {/* Page 1: Transport Document */}
        <div className="page page-break">
          <div className="header">
            <img className="logo" src="/lojfds.png" />
            <img
              src={
                "https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=" +
                  encodeURIComponent(new URL(docUrl).href) || "/placeholder.svg"
              }
              alt="QR"
              className="qr"
            />
          </div>

          <div className="doc-title">وثيقة نقل</div>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">رقم الوثيقة:</span>
              <span>{fmt(document.document_number)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">الحالة:</span>
              <span>{fmt(document.status)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">تاريخ الاستلام:</span>
              <span>{fmt(document.receipt_date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">تاريخ الخروج:</span>
              <span>{fmt(document.exit_date)}</span>
            </div>
          </div>

          <div className="section">
            <div className="section-title">بيانات الناقل:</div>
            <div className="section-content">
              <div className="field">
                <span className="field-label">الإسم:</span>
                <span>{fmt(document.carrier_name)}</span>
              </div>
              <div className="field">
                <span className="field-label">رقم الهاتف:</span>
                <span>{fmt(document.carrier_phone)}</span>
              </div>
              <div className="field">
                <span className="field-label">ملاحظات الناقل:</span>
                <span>{fmt(document.carrier_notes)}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              marginBottom: "15px",
            }}
          >
            <div className="section">
              <div className="section-title">بيانات الشاحنة:</div>
              <div className="section-content" style={{ padding: 0 }}>
                <div
                  className="grid-2col"
                  style={{ gridTemplateColumns: "1fr" }}
                >
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">الدولة</span>
                    <span className="cell-value">
                      {fmt(document.truck_country)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">المدينة</span>
                    <span className="cell-value">
                      {fmt(document.truck_city)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">رقم اللوحة</span>
                    <span className="cell-value">
                      {fmt(document.truck_plate_number)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">ترميز اللوحة</span>
                    <span className="cell-value">
                      {fmt(document.truck_plate_code)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">رمز مجموعة التصنيف</span>
                    <span className="cell-value">
                      {fmt(document.truck_classification_code)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">اللون</span>
                    <span className="cell-value">
                      {fmt(document.truck_color)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">تريلا</span>
                    <span className="cell-value">
                      {fmt(document.truck_type)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="section">
              <div className="section-title">بيانات السائق:</div>
              <div className="section-content" style={{ padding: 0 }}>
                <div
                  className="grid-2col"
                  style={{ gridTemplateColumns: "1fr", border: "none" }}
                >
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">رقم هوية السائق</span>
                    <span className="cell-value">
                      {fmt(document.driver_id_number)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">نوع الهوية</span>
                    <span className="cell-value">
                      {fmt(document.driver_id_type)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">اسم السائق</span>
                    <span className="cell-value">
                      {fmt(document.driver_name)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">الجنسية</span>
                    <span className="cell-value">
                      {fmt(document.driver_nationality)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">تاريخ ميلاد السائق</span>
                    <span className="cell-value">
                      {fmt(document.driver_birth_date)}
                    </span>
                  </div>
                  <div className="grid-cell" style={{ border: "none" }}>
                    <span className="cell-label">رقم جوال السائق</span>
                    <span className="cell-value">
                      {fmt(document.driver_phone)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div>دون أدنى مسؤولية على محتويات الوثيقة</div>
            <div>الصفحة 1 من 1</div>
          </div>
        </div>

        {/* Page 2: Cargo Manifest */}
        <div className="page">
          <div className="doc-title">وثيقة بيان حمولة</div>

          <div className="side-by-side">
            <div className="box">
              <div className="box-title">بيانات المرسل:</div>
              <div className="box-content">
                <div className="field">
                  <span className="field-label">الإسم:</span>
                  <span>{fmt(document.sender_name)}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم الهاتف:</span>
                  <span>{fmt(document.sender_phone)}</span>
                </div>
                <div className="field">
                  <span className="field-label">العنوان:</span>
                  <span>{fmt(document.sender_address)}</span>
                </div>
                <div className="field">
                  <span className="field-label">المدينة:</span>
                  <span>{fmt(document.sender_city)}</span>
                </div>
                <div className="field">
                  <span className="field-label">الدولة:</span>
                  <span>{fmt(document.sender_country)}</span>
                </div>
                <div className="field">
                  <span className="field-label">ملاحظات المرسل:</span>
                  <span></span>
                </div>
              </div>
            </div>

            <div className="box">
              <div className="box-title">بيانات المرسل إليه:</div>
              <div className="box-content">
                <div className="field">
                  <span className="field-label">الإسم:</span>
                  <span>{fmt(document.recipient_name)}</span>
                </div>
                <div className="field">
                  <span className="field-label">رقم الهاتف:</span>
                  <span>{fmt(document.recipient_phone)}</span>
                </div>
                <div className="field">
                  <span className="field-label">العنوان:</span>
                  <span>{fmt(document.recipient_address)}</span>
                </div>
                <div className="field">
                  <span className="field-label">المدينة:</span>
                  <span>{fmt(document.recipient_city)}</span>
                </div>
                <div className="field">
                  <span className="field-label">الدولة:</span>
                  <span>{fmt(document.recipient_country)}</span>
                </div>
                <div className="field">
                  <span className="field-label">ملاحظات المرسل إليه:</span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">بيانات البضاعة:</div>
            <div className="section-content">
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
          </div>

          <div className="section">
            <div className="section-title">خط سير الرحلة:</div>
            <div className="section-content">
              <div>
                من {fmt(document.route_from_city)} ,{" "}
                {fmt(document.route_from_city)} ,{" "}
                {fmt(document.route_from_country)} الى{" "}
                {fmt(document.route_to_city)} , {fmt(document.recipient_city)} ,{" "}
                {fmt(document.recipient_country)}
              </div>
            </div>
          </div>

          <div className="section">
            <div className="section-title">بيانات أجور النقل:</div>
            <div className="section-content">
              <div className="field">
                <span className="field-label">طريقة دفع الأجور:</span>
                <span>{fmt(document.payment_method)}</span>
              </div>
              <div className="field">
                <span className="field-label">تدفع من قبل:</span>
                <span>{fmt(document.payment_by)}</span>
              </div>
              <div className="field">
                <span className="field-label">تعليمات خاصة بدفع الأجور:</span>
                <span>{fmt(document.payment_instructions)}</span>
              </div>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: "15px" }}>
            <div className="info-item">
              <span className="info-label">رقم الوثيقة:</span>
              <span>{fmt(document.cargo_document_number)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">قابلة للتداول:</span>
              <span>{document.is_negotiable ? "نعم" : "لا"}</span>
            </div>
          </div>

          <div className="footer">
            <div>دون أدنى مسؤولية على محتويات الوثيقة</div>
            <div>الصفحة 1 من 1</div>
          </div>
        </div>
      </section>

      <button
        className="print-btn"
        onClick={handleDownload}
        disabled={downloading}
      >
        {downloading ? "جارٍ التحميل..." : "تحميل PDF"}
      </button>
    </div>
  );
}
