import cv2
import subprocess
from PIL import Image
from ultralytics import YOLO

# 1. Load the YOLOv8 nano model
model = YOLO('yolov8n.pt')

# 2. Open the video file
video_path = 'doorbell-footage.mp4'
cap = cv2.VideoCapture(video_path)

width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

# If FPS is 0 or reading a stream, force a default like 30
if fps == 0.0 or fps != fps: 
    fps = 30

rtmp_url = "rtmp:///live/test"

# Check if the video opened successfully
if not cap.isOpened():
    print("Error: Could not open video.")
    exit()

ffmpeg_command = [
    'ffmpeg',
    '-y',                     
    '-f', 'rawvideo',          
    '-vcodec', 'rawvideo',
    '-pix_fmt', 'bgr24',       
    '-s', f"{width}x{height}", 
    '-r', str(fps),            
    '-i', '-',               

    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-pix_fmt', 'yuv420p',    
    '-f', 'flv',               
    rtmp_url
]

process = subprocess.Popen(ffmpeg_command, stdin=subprocess.PIPE)

# 3. Process the video frame by frame
while cap.isOpened():
    # Read a single frame
    success, frame = cap.read()
    
    # If success is False, the video is over (or there's an error)
    if not success:
        print("End of video stream.")
        break
    frame = cv2.resize(frame, (width, height))

    # 4. Run AI prediction on the frame
    # classes=[0] tells YOLO to ONLY look for class 0, which is 'person' in the COCO dataset
    results = model(frame, classes=[0], conf=0.5, verbose=False) 

    person_detected = False

    # 5. Extract bounding box data and draw it
    # results is a list, we take the first item since we only passed in one frame
    for result in results:
        boxes = result.boxes # Get the bounding box outputs
        
        for box in boxes:
            person_detected = True

            # Extract the coordinates of the box (x1, y1 is top-left, x2, y2 is bottom-right)
            x1, y1, x2, y2 = box.xyxy[0].int().tolist()
            
            # Extract the confidence score (e.g., 0.85 means 85% sure it's a person)
            confidence = box.conf[0].item()

            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            label = f'Person: {confidence:.2f}'
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        if person_detected:
            try:

                pil_image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                prompt = "You are a firm home security AI. Look at the person in this image. Take note of what they look like or are wearing, and do whatever you can to convince them not to break into the house."

            except Exception as e:
                print(f"Error generating warning: {e}")

        process.stdin.write(frame.tobytes())

    # 7. Listen for the 'q' key to quit the program early
    if cv2.waitKey(1) & 0xFF == ord('q'):
        print("Quit by user.")
        break

# 8. Clean up resources
cap.release()
if process.stdin:
    process.stdin.close()
    process.wait()
    print("Pipeline shut down.")
