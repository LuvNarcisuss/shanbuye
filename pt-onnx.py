from ultralytics import YOLO
# 此代码将python识别的pt模型转换为前端可以识别的onnx模型


model_path = 'weights\best.pt'

model = YOLO(model_path)
model.export(
        format='onnx',
        device='cpu',
        simplify=False,
        half=False
    )
