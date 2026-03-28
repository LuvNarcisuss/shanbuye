import cv2
from ultralytics import YOLO
# 部署模型
def run_camera_inference():
    model_path = 'best.pt'
    model = YOLO(model_path)

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("无法打开摄像头")
        return
    print("开始检测，按 'q' 键退出...")

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        results = model.predict(source=frame, stream=True, conf=0.25, verbose=False)

        for r in results:
            annotated_frame = r.plot()

        cv2.imshow("YOLO Real-time Detection", annotated_frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_camera_inference()