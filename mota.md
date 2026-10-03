# ĐẶC TẢ THIẾT KẾ MOCK DASHBOARD — HỆ THỐNG TRACEGRAPH AI

> **Dự án:** TraceGraph AI — Giám sát Chuỗi Dữ liệu Sản xuất Thời gian thực & Dự đoán Lan truyền Tác động Sự cố
> **Cuộc thi:** DENSO Factory Hacks 2026 (Track 3: Data Utilization — Đề bài D3)
> **Đơn vị thực hiện:** Trường Đại học Phenikaa (Đội thi PSC_A2I)
> **Người phụ trách Frontend & UI/UX:** Vũ Quốc Việt
> **Phiên bản:** v1.0 — Chuẩn bị cho Cột mốc MVP Tuần 4

---

## 1. TỔNG QUAN KIẾN TRÚC GIAO DIỆN (UI/UX OVERVIEW)

Để tối ưu hóa thời gian phát triển và đảm bảo kịch bản pitching thuyết phục nhất trước Ban Giám khảo DENSO, hệ thống **TraceGraph AI Control Room** được thiết kế tinh gọn với **3 MÀN HÌNH CỐT LÕI (MINIMAL 3 PAGES)**.

3 màn hình này liên kết chặt chẽ với nhau theo một hành trình người dùng liền mạch (User Journey):

```
[Trang 1: Giám Sát Dòng Chảy Xưởng] 
        │
        ▼ (Click cảnh báo bất thường / Click phôi lỗi)
[Trang 2: Hộ Chiếu Số & Phả Hệ Đồ Thị] 
        │
        ▼ (Bấm "Phân tích Nguyên nhân & Lan truyền")
[Trang 3: Trung Tâm Phân Tích Sự Cố & Điều Hành Phân Quyền]
```

### Phong cách thiết kế công nghiệp (Design System):

* **Bảng màu chủ đạo:**
  * Nền: Nền sáng tối giản (`#F8FAFC` - Slate 50), thẻ nền trắng (`#FFFFFF`) có viền mảnh (`#E2E8F0` - Slate 200).
  * Điểm nhấn thông tin: Xanh Navy (`#0F172A`), Xanh Teal DENSO (`#0D9488`), Xanh Lam (`#2563EB`).
  * Trạng thái cảnh báo: Xanh lá (Bình thường `#16A34A`), Vàng hổ phách (Cảnh báo sớm `#D97706`), Đỏ cờ (Sự cố nghiêm trọng / NG `#DC2626`).
* **Nguyên tắc cốt lõi:**
  * **Zero Clutter:** Giảm thiểu tối đa chữ rườm rà, tập trung vào trực quan hóa dữ liệu và số đo định lượng.
  * **Sub-second Response:** Mọi thao tác click chuyển tab hoặc lọc dữ liệu phản hồi ngay lập tức dưới 100ms.
  * **Role-Adaptive:** Cung cấp góc nhìn đa chiều cho cả Quản đốc (Shift Leader), Quản lý Chất lượng (QC) và Bộ phận Kho vận.

---

## 2. CHI TIẾT 3 MÀN HÌNH CỐT LÕI

---

### TRANG 1: TỔNG QUAN XƯỞNG & DÒNG CHẢY DỮ LIỆU THỜI GIAN THỰC

* **Route:** `/` hoặc `/overview`
* **Mục đích:** Là "màn hình tác chiến" toàn cảnh tại phòng điều hành (Control Room), hiển thị nhịp đập sản xuất sống của 5 công đoạn và bắt sớm các điểm bất thường từ thiết bị biên (Edge).

#### Sơ đồ Bố cục Giao diện (ASCII Wireframe):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [LOGO] TraceGraph AI | DENSO DMVN Factory - Line #03 CNC Machining         [Ca 1: 06:00 - 14:00] [Live] │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Thẻ KPI 1: Sản lượng ca]   [Thẻ KPI 2: Tỷ lệ OK/NG]    [Thẻ KPI 3: Độ trễ Graph]  [Cảnh báo sớm Edge]  │
│      4,850 / 5,000 phôi           99.2% OK (0.8% NG)              3.8 ms             01 Máy rung bất thường│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ BẢN ĐỒ LUỒNG 5 CÔNG ĐOẠN SẢN XUẤT (PIPELINE DATA FLOW)                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ 1. CẤP PHÔI  │───>│ 2. GIA CÔNG  │───>│  3. LẮP RÁP  │───>│  4. ĐO QC   │───>│ 5. XUẤT KHO  │       │
│  │ Lot_A08: 500 │    │ 4 máy CNC    │    │ 2 trạm siết  │    │ CMM Phòng đo │    │ Pallet_P01   │       │
│  │ Status: OK   │    │ [CNC-03: !]  │    │ Status: OK   │    │ [SN-98214: NG│    │ Ready: 4,200 │       │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘       │
├──────────────────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ TRẠNG THÁI TRẠM MÁY (MACHINE TELEMETRY GRID)     │ NHẬT KÝ SỰ KIỆN NẠP BIÊN THỜI GIAN THỰC (EDGE FEED)   │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │ [10:14:02] [Gate 1] Quét Serial SN-98250 -> Neo4j OK │
│ │ CNC-01  │ │ CNC-02  │ │ CNC-03  │ │ CNC-04  │  │ [10:14:05] [Gate 2] Modbus CNC-03: VIB=2.85g [ALERT] │
│ │ Rung 0.8│ │ Rung 0.9│ │ Rung 2.8│ │ Rung 0.7│  │ [10:14:08] [Gate 3] CMM File Import: 50 items parsed │
│ │ [Hoạt   │ │ [Hoạt   │ │ [CẢNH   │ │ [Hoạt   │  │ [10:14:10] [Gate 4] CMM cờ NG: Serial SN-98214 (+0.025)│
│ │  động]  │ │  động]  │ │  BÁO !] │ │  động]  │  │ ------------------------------------------------ │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │ [ Nút Demo: Kích hoạt Giả lập Sự cố SN-98214 ]    │
└──────────────────────────────────────────────────┴──────────────────────────────────────────────────────┘
```

#### Các Component UI Chính:

1. **Thanh Header & KPI Bar:**
   * `Total Production`: Hiển thị tiến độ hoàn thành đơn hàng (VD: 4,850/5,000 phôi, thanh progress bar xanh).
   * `Defect Rate`: Tỷ lệ lỗi (0.8%).
   * `Edge Latency`: Tốc độ đồng bộ từ trạm biên về máy chủ (`< 5ms`).
   * `System Status Badge`: Nhấp nháy màu vàng/đỏ khi có cảnh báo máy hoặc phôi lỗi.
2. **Pipeline 5 Công đoạn Xưởng:**
   * 5 Step Cards nằm ngang nối nhau bằng mũi tên động.
   * Thể hiện thông lượng (Throughput) theo thời gian thực tại từng khâu.
   * Công đoạn 2 hiển thị biểu tượng cảnh báo tại máy `CNC-03`.
   * Công đoạn 4 hiển thị cờ đỏ cảnh báo linh kiện vừa bị máy đo CMM đánh rớt (`QC_NG`).
3. **Machine Telemetry Grid:**
   * Hiển thị danh thiếp của từng máy CNC (CNC-01 đến CNC-04).
   * Đo lường thời gian thực: Độ rung trục chính (Vibration RMS), Nhiệt độ dầu làm mát (°C), Dòng tải (A).
   * `CNC-03` chuyển viền đỏ, nhấp nháy chỉ số rung chấn `2.85g` (vượt ngưỡng cho phép `1.5g`).
4. **Bảng Điều Khiển Giả Lập Sự Cố (Demo Simulator Bar):**
   * Nút bấm tiện ích: `[Kích hoạt Sự cố Thực nghiệm SN-98214]` $\rightarrow$ Dùng khi demo trực tiếp để dữ liệu nhảy sang trạng thái báo động mà không cần nối phần cứng thật.

---

### TRANG 2: HỘ CHIẾU SỐ & PHẢ HỆ ĐỒ THỊ TRI THỨC (Digital Product Passport & Graph Lineage)

* **Route:** `/lineage/[serial_number]` (Ví dụ: `/lineage/SN-98214`)
* **Mục đích:** Khẳng định thế mạnh vượt trội của **CSDL Đồ thị (Neo4j)** so với CSDL SQL truyền thống; cho phép tra cứu phả hệ 2 chiều (ngược về nguồn gốc vật tư, xuôi theo đơn hàng xuất kho) chỉ trong **< 30 mili-giây**.

#### Sơ đồ Bố cục Giao diện (ASCII Wireframe):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ < Quay lại Tổng quan | HỘ CHIẾU SẢN PHẨM SỐ (DIGITAL PRODUCT PASSPORT)        [Tra cứu: SN-98214   [Q]] │
├──────────────────────────────────────────────────────────┬──────────────────────────────────────────────┤
│ KHUNG MẠNG LƯỚI ĐỒ THỊ PHẢ HỆ (INTERACTIVE GRAPH VIEW)   │ BẢNG THUỘC TÍNH CHI TIẾT (METADATA INSPECTOR)│
│                                                          │                                              │
│                  (Lệnh SX: Order_101)                    │ Mã Serial: SN-98214 (Van Tiết Lưu T-08)      │
│                            │                             │ Thời điểm cấp phôi: 10/10/2026 08:30:15      │
│                     [QUẢN_LÝ_LÔ]                         │ Trạng thái kiểm định: ❌ NG (No Good)        │
│                            ▼                             │                                              │
│    (Lô Phôi: Lot_A08) ────────> ( Sản Phẩm )             │ ── THÔNG SỐ GIA CÔNG MÁY CNC-03 ──           │
│       [Nhà CC: Nippon]            SN-98214               │ • Thời gian gá đặt: 08:42:10 - 08:44:30      │
│                                   (NG - ĐỎ)              │ • Độ rung trục chính: 2.85g (VƯỢT NGƯỠNG !)  │
│                            /         │         \         │ • Nhiệt độ dầu cắt: 62.5°C                   │
│                 [GIA_CÔNG]     [KIỂM_ĐỊNH]     [XUẤT_KHO]│ • Dòng tải Spindle: 24.2 A                   │
│                     ▼                ▼             ▼     │ • Mã dao cắt: Dao tiện T04 (Tuổi thọ 94%)    │
│             (Máy: CNC-03)       (Trạm QC)     (Pallet)   │                                              │
│             [Bạc đạn rơ !]     [CMM: Lệch      Pallet_P1 │ ── KẾT QUẢ PHÒNG ĐO CMM ──                   │
│                                 +0.025mm]    [Tạm khóa]  │ • Dung sai đường kính ngoài: +0.025 mm       │
│                                                          │ • Tiêu chuẩn bản vẽ: ± 0.005 mm (Lệch chuẩn) │
│ [Controls: Zoom in / Zoom out / Reset / Highlight Path]  │                                              │
├──────────────────────────────────────────────────────────┴──────────────────────────────────────────────┤
│ NÚT HÀNH ĐỘNG: [ Chuyển sang Phân tích Nguyên nhân Gốc (TreeSHAP RCA) & Lan truyền Tác động ──> ]       │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Các Component UI Chính:

1. **Interactive Graph Visualizer Canvas (Cytoscape.js / React Flow):**
   * Nút trung tâm: Nút `Sản phẩm (SN-98214)` nổi bật kích thước lớn, viền đỏ cảnh báo.
   * Các nút vệ tinh liên kết:
     * `Lô Phôi (Lot_A08)`: Nguồn gốc phôi thép nhập từ nhà cung cấp Nippon Steel.
     * `Lệnh Sản Xuất (Order_101)`: Kế hoạch giao hàng cho đối tác Toyota.
     * `Máy Gia Công (CNC-03)`: Máy trực tiếp phay/tiện linh kiện.
     * `Kiểm Định (QC_Test)`: Kết quả máy đo CMM ghi nhận lệch dung sai.
     * `Thành Phẩm (Pallet_P1)`: Thùng hàng đang chờ xuất xưởng.
   * Cạnh đồ thị (Edges): Thể hiện rõ tên quan hệ (`CẤP_PHÔI_CHO`, `GIA_CÔNG_TẠI`, `KIỂM_ĐỊNH_TẠI`, `ĐÓNG_GÓI_VÀO`).
   * Tương tác: Người dùng có thể kéo thả nút, zoom in/out, hoặc click vào từng nút để xem thông tin chi tiết.
2. **Metadata Inspector Panel (Cột bên phải):**
   * Tự động hiển thị toàn bộ thuộc tính của nút đang được chọn.
   * Khi click vào nút `CNC-03`: Hiển thị biểu đồ dạng sóng (Sparkline) độ rung chấn và nhiệt độ tại thời điểm gia công chi tiết đó.
   * Khi click vào nút `QC_Test`: Hiển thị kích thước đo CMM thực tế so sánh với dung sai bản vẽ thiết kế CAD.
3. **Nút Chuyển Tiếp Tác Chiến:**
   * Nút CTA lớn nổi bật: *"Chuyển sang Phân tích Nguyên nhân Gốc & Lan truyền Tác động"* $\rightarrow$ Dẫn trực tiếp sang Trang 3 kèm tham số `serial=SN-98214`.

---

### TRANG 3: TRUNG TÂM PHÂN TÍCH SỰ CỐ & ĐIỀU HÀNH PHÂN QUYỀN (Incident Analysis & Action Room)

* **Route:** `/incident/[incident_id]` (Ví dụ: `/incident/INC-2026-1014`)
* **Mục đích:** Là **"trung tâm trí tuệ nhân tạo"** giải quyết triệt để đề bài D3: Định vị chính xác nguyên nhân gốc (TreeSHAP RCA), khoanh vùng phạm vi lây lan (Forward Impact Traversal), mô phỏng What-if và phân quyền thực thi hành động đối ứng cho 3 bộ phận.

#### Sơ đồ Bố cục Giao diện (ASCII Wireframe):

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ BÁO CÁO PHÂN TÍCH SỰ CỐ: INC-2026-1014 (Sản phẩm: SN-98214 - Khâu Gia công CNC)     [Thời gian: 10:15] │
├──────────────────────────────────────────────────┬──────────────────────────────────────────────────────┤
│ KHỐI 1: BÓC TÁCH NGUYÊN NHÂN GỐC (TREESHAP RCA)   │ KHỐI 2: LAN TRUYỀN TÁC ĐỘNG & DANH SÁCH CÁCH LY      │
│                                                  │                                                      │
│ Biểu đồ đóng góp nguyên nhân (SHAP Value):       │ • Quy mô cách ly dự phòng: 48 SERIAL NGHI VẤN        │
│ ┌──────────────────────────────────────┐         │ • Quy mô cả lô nếu xử lý thủ công: 1,000 cái         │
│ │ Rung trục chính CNC-03:  +68% ██████ │         │ • Số sản phẩm an toàn được cứu: 952 CÁI (TIẾT KIỆM !)│
│ │ Độ mòn dao cắt T04:     +22% ██      │         │                                                      │
│ │ Nhiệt độ dầu cắt gọt:   +10% █       │         │ Bảng 48 Serial cùng mẻ gia công lúc CNC-03 bị rung:  │
│ └──────────────────────────────────────┘         │ ┌──────────┬──────────┬──────────┬─────────┬────────┐│
│                                                  │ │ SN-98201 │ SN-98202 │ ...      │SN-98248 │ [Khóa] ││
│ Kết luận AI: Lỗi lệch dung sai do bạc đạn trục  │ └──────────┴──────────┴──────────┴─────────┴────────┘│
│ chính CNC-03 bị rơ lắc kết hợp dao T04 đã mòn.   │ [ Nút: Xuất Danh Sách / Đồng Bộ Lệnh Khóa Lên ERP ]  │
├──────────────────────────────────────────────────┴──────────────────────────────────────────────────────┤
│ KHỐI 3: MÔ PHỎNG KỊCH BẢN ỨNG PHÓ THỜI GIAN THỰC (WHAT-IF SIMULATION)                                   │
│ • Giả định: Dừng máy CNC-03 trong 15 phút để thay dao T04 & căn chỉnh bạc đạn trục chính.               │
│ • Dự báo tác động dây chuyền: Thời gian trễ hạn đơn hàng Toyota: 1.5 giờ.                              │
│ • Đề xuất tối ưu tự động: Điều hướng 50% phôi từ CNC-03 sang trạm dự phòng CNC-04 (Tải hiện tại: 42%).   │
│   ==> Giảm thời gian trễ đơn hàng xuống: 0 GIỜ (Bàn giao đúng tiến độ 100%).                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ KHỐI 4: THẺ HÀNH ĐỘNG PHÂN QUYỀN ĐỐI ỨNG (ROLE-BASED ACTION CARDS)                                      │
│ ┌───────────────────────────────┐ ┌───────────────────────────────┐ ┌─────────────────────────────────┐ │
│ │ 1. QUẢN ĐỐC (SHIFT LEADER)    │ │ 2. QUẢN LÝ QC (QC MANAGER)    │ │ 3. KHO VẬN (LOGISTICS)          │ │
│ │ • Nhận cảnh báo: CNC-03 rung  │ │ • Nhận danh sách: Đúng 48     │ │ • Nhận lệnh cách ly: Khóa mã    │ │
│ │ • Lệnh: Tạm dừng máy 15 phút  │ │   Serial nghi vấn.            │ │   48 Serial trên hệ thống kho.  │ │
│ │ • Hành động: Thay dao T04     │ │ • Hành động: Đo kiểm 100%     │ │ • Hành động: Chặn quét xuất kho │ │
│ │   [ Nút: Xác nhận Dừng máy ]  │ │   [ Nút: Nhận Danh Sách QC ]  │ │   [ Nút: Khóa Xuất Xưởng ]      │ │
│ └───────────────────────────────┘ └───────────────────────────────┘ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Các Component UI Chính:

1. **TreeSHAP Root Cause Waterfall/Bar Chart:**
   * Trực quan hóa giá trị SHAP đóng góp của từng cảm biến:
     * Rung trục chính CNC-03: `+68%` (Màu đỏ - Nguyên nhân chính).
     * Mòn dao T04: `+22%` (Màu cam).
     * Nhiệt độ dầu cắt: `+10%` (Màu vàng).
   * Box văn bản tóm tắt nguyên nhân bằng tiếng Việt tự nhiên dễ hiểu.
2. **Quarantine & Impact Isolation Panel:**
   * So sánh tương phản ấn tượng: **Cách ly 48 phôi** vs **Cách ly 1.000 phôi** $\rightarrow$ Làm nổi bật con số **giảm 95,2% phế phẩm loại oan** (cứu 952/1.000 phôi).
   * Bảng danh sách cuộn nhanh 48 số Serial nghi vấn kèm nút bấm *"Đồng bộ lệnh cách ly sang hệ thống ERP/WMS"*.
3. **What-if Simulation Engine Widget:**
   * Thanh trượt (Slider) giả định thời gian dừng máy (VD: 15 phút, 30 phút, 1 giờ).
   * Thuật toán tự động tính toán lại năng lực trạm đệm (Buffer capacity) và đề xuất cân bằng tải sang máy dự phòng `CNC-04`.
4. **3 Role-Based Action Cards:**
   * 3 thẻ phân quyền đại diện cho 3 vị trí nhân sự chủ chốt tại xưởng DENSO.
   * Mỗi thẻ có trạng thái (Chờ xác nhận $\rightarrow$ Đã thực thi) và nút bấm tương tác trực tiếp.

---

## 3. KỊCH BẢN THUYẾT TRÌNH DEMO TRỰC TIẾP (PITCHING WALKTHROUGH)

Kịch bản 3 phút được thiết kế chính xác để người thuyết trình (Presenter) phối hợp nhịp nhàng cùng người thao tác màn hình (Operator):

|    Mốc thời gian    | Màn hình thao tác           | Lời thoại thuyết trình gợi ý                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :-------------------: | :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0:00 - 0:45** | **Trang 1: Overview**    | *"Kính thưa Ban Giám khảo, đây là giao diện Control Room theo dõi toàn bộ 5 công đoạn xưởng của DENSO Việt Nam theo thời gian thực. Bình thường dữ liệu chảy rất mượt với độ trễ dưới 5ms. Đột nhiên, mô hình AI Isolation Forest phát hiện máy CNC-03 bị rung chấn bất thường lên tới 2.85g và trạm đo CMM gắn cờ lỗi linh kiện SN-98214. Chúng tôi bấm ngay vào linh kiện này..."* |
| **0:45 - 1:45** | **Trang 2: Lineage**     | *"...Thay vì mở 15 bảng SQL để dò tìm mất 3 ngày, chỉ sau 30 mili-giây, Đồ thị Hộ chiếu số hiện ra toàn bộ phả hệ: linh kiện được cấp phôi từ lô nào, gia công tại máy CNC-03 lúc mấy giờ, và bị lệch dung sai ra sao. Giờ đây, tôi kích hoạt lõi AI phân tích nguyên nhân gốc..."*                                                                                                             |
| **1:45 - 3:00** | **Trang 3: Action Room** | *"...Chỉ trong 2 giây, thuật toán TreeSHAP đã bóc tách rõ ràng: 68% nguyên nhân do rung trục chính và 22% do dao mòn. Đặc biệt, thuật toán Graph Traversal đã khoanh vùng chính xác đúng 48 linh kiện nghi vấn, cứu thoát 952 sản phẩm không bị tiêu hủy oan. Hệ thống lập tức bắn lệnh đối ứng phân quyền cho Quản đốc, QC và Kho vận chỉ bằng 1 nút bấm!"*                              |

---

## 4. STACK CÔNG NGHỆ KHUYẾN NGHỊ CHO FRONTEND (DÀNH CHO VŨ QUỐC VIỆT)

Để hoàn thiện bộ Mockup này trong thời gian ngắn nhất mà giao diện vẫn đạt chuẩn công nghiệp cao cấp:

| Thành phần                        | Công nghệ khuyến nghị                                   | Lý do lựa chọn                                                                                    |
| :---------------------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Core Framework**            | **Next.js 14 (App Router) + React 18**                | Tốc độ render cực nhanh, cấu trúc thư mục rõ ràng, dễ demo local hoặc deploy Vercel.     |
| **Styling & CSS**             | **TailwindCSS**                                       | Tùy biến nhanh, dễ đồng bộ màu nhận diện DENSO (Teal, Navy, Gray).                          |
| **Component UI Library**      | **shadcn/ui**                                         | Bộ UI mã nguồn mở hiện đại nhất hiện nay (Card, Badge, Button, Dialog, Table, Tabs).        |
| **Trực quan hóa Đồ thị** | **`@xyflow/react` (React Flow) hoặc Cytoscape.js** | Nhẹ, mượt mà, hỗ trợ zoom, kéo thả node và animate đường viền dữ liệu cực đẹp.     |
| **Biểu đồ & Analytics**    | **Tremor hoặc Recharts**                             | Cực kỳ tối ưu cho các biểu đồ SHAP Waterfall, thanh tiến độ KPI và sóng rung chấn.     |
| **Icon Set**                  | **Lucide React**                                      | Hệ thống icon tối giản, sắc nét, đầy đủ icon công nghiệp (Barcode, CPU, Factory, Alert). |
| **State Management**          | **Zustand**                                           | Quản lý trạng thái giả lập (Mock Simulator) nhẹ nhàng, không gây giật lag.                |

---

## 5. CHECKLIST NGHIỆM THU MOCKUP MVP (TUẦN 4)

- [ ] **Giao diện Trang 1:**
  - [ ] Hiển thị đủ 4 thẻ KPI đầu trang.
  - [ ] 5 khối công đoạn xưởng có hiệu ứng luồng dữ liệu chạy.
  - [ ] Thẻ máy CNC-03 nhấp nháy trạng thái cảnh báo khi bấm nút giả lập.
- [ ] **Giao diện Trang 2:**
  - [ ] Khung đồ thị hiển thị tối thiểu 6 node (Sản phẩm, Máy CNC, Lô phôi, Lệnh SX, QC Test, Pallet).
  - [ ] Click vào node mở được bảng thông tin chi tiết ở cạnh phải.
  - [ ] Nút chuyển sang Trang 3 hoạt động trơn tru.
- [ ] **Giao diện Trang 3:**
  - [ ] Biểu đồ TreeSHAP hiển thị đúng 3 thông số đóng góp (+68%, +22%, +10%).
  - [ ] Bảng cuộn danh sách 48 Serial cách ly.
  - [ ] Khung mô phỏng What-if với kết quả điều hướng 50% tải sang CNC-04.
  - [ ] 3 thẻ hành động có nút bấm đổi trạng thái ("Đã xác nhận").
- [ ] **Tính năng Pitching:**
  - [ ] Nút Reset trạng thái về ban đầu để diễn tập pitching nhiều lần liên tiếp.

---

*Tài liệu thuộc bản quyền của Đội thi TraceGraph AI — Trường Đại học Phenikaa (DENSO Factory Hacks 2026).*
