# DEMO BẢO MẬT CONTAINER & QUẢN LÝ BÍ MẬT

## 1. Giới thiệu Đề tài

Dự án này là một bản demo kỹ thuật, tập trung vào hai nguyên tắc cơ bản trong bảo mật Container và quy trình DevSecOps: Hardening Container Image (làm cứng Image) và Quản lý Bí mật (Secret Management).

Chúng em sử dụng một ứng dụng Node.js đơn giản làm đối tượng thử nghiệm để chứng minh cách loại bỏ lỗ hổng và tách biệt mật khẩu nhạy cảm khỏi mã nguồn.

### Mục tiêu Bảo mật Chính:

1.  **Giảm bề mặt tấn công:** Tối ưu hóa Image Docker để giảm thiểu lỗ hổng hệ thống.
2.  **Bảo vệ Bí mật:** Đảm bảo mật khẩu database được truyền vào Container thông qua Kubernetes Secret một cách an toàn, không bị lưu trữ trong Image.

## 2. Công nghệ Sử dụng

**Ngôn ngữ**: Node.js (Express Framework) Backend ứng dụng demo.
**Containerization**: Docker Đóng gói ứng dụng thành Image.
**Bảo mật Image**: Trivy (Scanner) Quét lỗ hổng, chứng minh hiệu quả của Hardening. 
**Orchestration**: Kubernetes (K8s) Triển khai ứng dụng và quản lý Service, đặc biệt là Secrets. 
**Deployment**: `kubectl` Công cụ giao tiếp với Kubernetes Cluster.

---

## 3. Cấu trúc Thư mục Dự án

web-app-security-demo/
├── .gitignore          # [Hệ thống] Loại trừ các thư mục rác (như node_modules) theo yêu cầu nộp bài.
├── deployment.yaml     # [K8s Config] Định nghĩa Deployment, Service (port 8088), và cách ánh xạ K8s Secret vào Container.
├── Dockerfile.secure   # [Bảo mật Image] File Dockerfile đã được hardening bằng Multi-Stage Build và Non-root User.
├── Dockerfile.bad      # [Image Demo] File Dockerfile dùng để build Image có nhiều lỗ hổng (dùng cho so sánh Trivy).
├── db-password.txt     # [Secret] Chứa mật khẩu demo, dùng để tạo Kubernetes Secret.
├── package.json        # [Node.js Config] Khai báo các dependency của ứng dụng.
└── server.js           # [Mã nguồn] Ứng dụng Node.js, nơi đọc biến môi trường DB_PASSWORD để chứng minh Secret Management.

## 4. Hướng dẫn Cài đặt & Chạy Chương trình

### Yêu cầu Môi trường

* **Docker Desktop** (kèm theo **Kubernetes đã được kích hoạt**).
* **kubectl** (đã cài đặt và kết nối với K8s Cluster cục bộ).
* **Trivy** (đã cài đặt để thực hiện quét Image demo).

### Khắc phục Xung đột Cổng

Service được cấu hình sử dụng cổng **8088** trong `deployment.yaml` để tránh xung đột với các máy chủ cục bộ (như Apache/XAMPP) đang chiếm cổng 80.

## 5. Chuỗi lệnh chạy demo

### Build và Quét Trivy Image "Xấu" để so sánh
docker build -t my-app-bad:latest -f Dockerfile.bad .
trivy image my-app-bad:latest

### Build và Quét Trivy Image (Sử dụng kỹ thuật Hardening, Multi-Stage Build, và user non-root)
docker build -t my-app-secure:latest -f Dockerfile.secure .
trivy image my-app-secure:latest

### Xóa Secret cũ (nếu có)
kubectl delete secret app-secrets --ignore-not-found=true

### Tạo Secret mới từ file db-password.txt
kubectl create secret generic app-secrets --from-file=DB_PASSWORD=db-password.txt

### Áp dụng cấu hình Deployment và Service
kubectl apply -f deployment.yaml

### Buộc Deployment khởi động lại để kéo Image và Secret mới nhất
kubectl rollout restart deployment secure-app-deployment

### Kiểm tra trạng thái Pod (Cần thấy 1/1 READY và Running)
kubectl get pods

### Kiểm tra trạng thái Service (Cần thấy cổng 8088)
kubectl get svc

## 6. Tài khoản demo và kết quả: 

Ứng dụng không có tài khoản đăng nhập. Mật khẩu được sử dụng là một bí mật (Secret) được cấp phát tự động

### Tài khoản demo (Tham số bí mật):
Vai trò     | Tên tham số | Giá trị được truyền | Ghi chú
Mật khẩu DB | DB_PASSWORD | minhhieuz20004      | Giá trị được lấy từ K8s Secret