from ultralytics import YOLO

model = YOLO('yolov8n.pt')
export_path = model.export(
    format='ncnn',  # Change this based on your hardware
    half=True,          # Uses FP16 precision instead of FP32 (Double the speed, tiny accuracy loss)
    imgsz=320,          # Bake in the smaller image size we discussed for faster inference
    dynamic=False       # Lock the image size for better optimization
)
