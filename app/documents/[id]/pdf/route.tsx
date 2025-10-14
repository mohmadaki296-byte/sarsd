import { db } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { type NextRequest, NextResponse } from "next/server";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const docRef = doc(db, "shipping_documents", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const document = { id: docSnap.id, ...docSnap.data() } as ShippingDocument;
  const cargoItems = (document.cargo_items as CargoItem[]) || [];

  // Generate HTML for PDF
  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>وثيقة نقل - ${document.document_number}</title>
  <style>
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
    }
    
    .page {
      width: 100%;
      max-width: 210mm;
      margin: 0 auto;
      background: white;
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
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1>وثيقة نقل</h1>
      <div class="header-info">
        <div>رقم الوثيقة: ${document.document_number || ""}</div>
        <div>رقم الترخيص: ${document.license_number || ""}</div>
      </div>
    </div>

    <!-- Carrier Info -->
    <div class="section">
      <div class="section-title">بيانات الناقل</div>
      <div class="section-content">
        <div class="two-columns">
          <div>
            <div class="field">
              <span class="field-label">الإسم:</span>
              <span class="field-value">${document.carrier_name || ""}</span>
            </div>
            <div class="field">
              <span class="field-label">رقم الهاتف:</span>
              <span class="field-value">${document.carrier_phone || ""}</span>
            </div>
          </div>
          <div>
            <div class="field">
              <span class="field-label">تاريخ الاستلام:</span>
              <span class="field-value">${
                document.receipt_date || "لم يحدد"
              }</span>
            </div>
            <div class="field">
              <span class="field-label">الحالة:</span>
              <span class="field-value">${document.status || ""}</span>
            </div>
          </div>
        </div>
        ${
          document.carrier_notes
            ? `<div class="field" style="margin-top: 8px;">
          <span class="field-label">ملاحظات الناقل:</span>
          <span class="field-value">${document.carrier_notes}</span>
        </div>`
            : ""
        }
      </div>
    </div>

    <!-- Driver and Truck Info -->
    <div class="two-columns">
      <div class="section">
        <div class="section-title">بيانات السائق</div>
        <div class="section-content">
          <div class="field">
            <span class="field-label">اسم السائق:</span>
            <span class="field-value">${document.driver_name || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رقم هوية السائق:</span>
            <span class="field-value">${document.driver_id_number || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">نوع الهوية:</span>
            <span class="field-value">${document.driver_id_type || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">الجنسية:</span>
            <span class="field-value">${
              document.driver_nationality || ""
            }</span>
          </div>
          <div class="field">
            <span class="field-label">تاريخ ميلاد السائق:</span>
            <span class="field-value">${document.driver_birth_date || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رقم جوال السائق:</span>
            <span class="field-value">${document.driver_phone || ""}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">بيانات الشاحنة</div>
        <div class="section-content">
          <div class="field">
            <span class="field-label">الدولة:</span>
            <span class="field-value">${document.truck_country || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">المدينة:</span>
            <span class="field-value">${document.truck_city || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رقم اللوحة:</span>
            <span class="field-value">${
              document.truck_plate_number || ""
            }</span>
          </div>
          <div class="field">
            <span class="field-label">ترميز اللوحة:</span>
            <span class="field-value">${document.truck_plate_code || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رمز مجموعة التصنيف:</span>
            <span class="field-value">${
              document.truck_classification_code || ""
            }</span>
          </div>
          <div class="field">
            <span class="field-label">اللون:</span>
            <span class="field-value">${document.truck_color || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">${document.truck_type || "تريلا"}:</span>
            <span class="field-value">${
              document.truck_plate_number || ""
            }</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Route Info -->
    <div class="section">
      <div class="section-title">خط سير الرحلة</div>
      <div class="section-content">
        <div style="text-align: center; font-weight: bold;">
          من ${document.route_from_city || ""}, ${
    document.route_from_country || ""
  } الى ${document.route_to_city || ""}, ${document.route_to_country || ""}
        </div>
      </div>
    </div>

    <!-- Sender and Recipient Info -->
    <div class="two-columns">
      <div class="section">
        <div class="section-title">بيانات المرسل</div>
        <div class="section-content">
          <div class="field">
            <span class="field-label">الإسم:</span>
            <span class="field-value">${document.sender_name || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">العنوان:</span>
            <span class="field-value">${document.sender_address || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">المدينة:</span>
            <span class="field-value">${document.sender_city || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">الدولة:</span>
            <span class="field-value">${document.sender_country || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رقم الهاتف:</span>
            <span class="field-value">${document.sender_phone || ""}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">بيانات المرسل إليه</div>
        <div class="section-content">
          <div class="field">
            <span class="field-label">الإسم:</span>
            <span class="field-value">${document.recipient_name || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">العنوان:</span>
            <span class="field-value">${document.recipient_address || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">المدينة:</span>
            <span class="field-value">${document.recipient_city || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">الدولة:</span>
            <span class="field-value">${document.recipient_country || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">رقم الهاتف:</span>
            <span class="field-value">${document.recipient_phone || ""}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Cargo Items -->
    <div class="section">
      <div class="section-title">بيانات البضاعة</div>
      <div class="section-content">
        ${
          cargoItems.length > 0
            ? `
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
            ${cargoItems
              .map(
                (item) => `
              <tr>
                <td>${item.description || ""}</td>
                <td>${item.quantity || ""}</td>
                <td>${item.weight || ""}</td>
                <td>${item.unit || ""}</td>
                <td>${item.dimensions || ""}</td>
                <td>${item.status || ""}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        `
            : "<p>لا توجد بيانات بضاعة</p>"
        }
      </div>
    </div>

    <!-- Payment Info -->
    <div class="section">
      <div class="section-title">بيانات أجور النقل</div>
      <div class="section-content">
        <div class="two-columns">
          <div class="field">
            <span class="field-label">تدفع من قبل:</span>
            <span class="field-value">${document.payment_by || ""}</span>
          </div>
          <div class="field">
            <span class="field-label">طريقة دفع الأجور:</span>
            <span class="field-value">${document.payment_method || ""}</span>
          </div>
        </div>
        ${
          document.payment_instructions
            ? `<div class="field" style="margin-top: 8px;">
          <span class="field-label">تعليمات خاصة بدفع الأجور:</span>
          <span class="field-value">${document.payment_instructions}</span>
        </div>`
            : ""
        }
      </div>
    </div>

    <!-- Cargo Document Number -->
    ${
      document.cargo_document_number
        ? `
    <div class="section">
      <div class="section-title">وثيقة بيان حمولة</div>
      <div class="section-content">
        <div class="field">
          <span class="field-label">رقم الوثيقة:</span>
          <span class="field-value">${document.cargo_document_number}</span>
        </div>
        <div class="field">
          <span class="field-label">قابلة للتداول:</span>
          <span class="field-value">${
            document.is_negotiable ? "نعم" : "لا"
          }</span>
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- Footer -->
    <div class="footer">
      دون أدنى مسؤولية على محتويات الوثيقة
    </div>
    
    <div class="page-number">
      الصفحة 1 من 1
    </div>
  </div>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="document-${document.document_number}.html"`,
    },
  });
}
