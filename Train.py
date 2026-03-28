from ultralytics import YOLO
import torch
import gc
import os
#训练代码

def main():
    model_configs = {"yolov8n"}

    data_path = "img/train"

    total_models = sum(len(sizes) for sizes in model_configs.values())
    current_count = 1

    for base_name, sizes in model_configs.items():
        for size in sizes:
            model_name = f"{base_name}{size}-seg"
            weights_file = f"{model_name}.pt"

            if not os.path.exists(weights_file):
                save_dir_name = f"{model_name}_sun_train"

            print(f"[{current_count}/{total_models}] 正在训练: {model_name.upper()}")
            print(f"保存目录: {save_dir_name}")

            try:
                model = YOLO(weights_file)

                model.train(
                    data=data_path,
                    epochs=200,
                    imgsz=640,
                    batch=8,
                    device=0,
                    workers=0,
                    cache=False,
                    project="runs/train_loop",
                    name=save_dir_name,
                    mosaic=1.0,
                    mixup=0.1,
                    save=True,
                    plots=True
                )

            finally:
                if 'model' in locals():
                    del model
                gc.collect()
                torch.cuda.empty_cache()
                current_count += 1


if __name__ == '__main__':
    main()