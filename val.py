import os
from ultralytics import YOLO
import torch
#验证代码

def batch_inference_comparison():
    model_configs = {"yolov8n"}

    source_images = r"img/val"

    train_results_dir = "runs/segment/runs/train_loop"

    output_root = "runs/predict_comparison"

    for base_name, sizes in model_configs.items():
        for size in sizes:
            model_id = f"yolo26s-seg"
            weights_path = os.path.join(train_results_dir, f"{model_id}_sun_train", "weights", "best.pt")

            if not os.path.exists(weights_path):
                print(f"跳过 {model_id}: 找不到权重文件 {weights_path}")
                continue

            print(f"\n正在使用模型 {model_id} 进行预测...")

            try:
                model = YOLO(weights_path)

                model.predict(
                    source=source_images,
                    save=True,
                    project=output_root,
                    name=model_id,
                    conf=0.25,
                    device=0,
                    imgsz=640,
                    line_width=2
                )
                print(f"{model_id} 检测完成。")

            except Exception as e:
                print(f"{model_id} 预测出错: {e}")

    print(f"所有模型检测完毕！结果保存在: {os.path.abspath(output_root)}")


if __name__ == "__main__":
    torch.cuda.empty_cache()
    batch_inference_comparison()