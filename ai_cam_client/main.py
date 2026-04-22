import cv2
import subprocess
from PIL import Image
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
video_pathes = ['./doorbell-video.mp4', 
                './doorbell-video_2.mp4', 
                './doorbell-video_3.mp4',
                './doorbell-video_4.mp4',
                './doorbell-video_5.mp4',
                './doorbell-video_6.mp4',
                ]
rtmp_url = "rtmp:///live/test"


def process_video(video_path, rtmp_url):
    cap = cv2.VideoCapture(video_path)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)

    if fps == 0.0 or fps != fps: 
        fps = 30

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

    if not cap.isOpened():
        print("Error: Could not open video.")
        exit()

    while cap.isOpened():
        success, frame = cap.read()
        
        if not success:
            print("End of video stream.")
            break
        frame = cv2.resize(frame, (width, height))

        results = model(frame, classes=[0], conf=0.5, verbose=False) 

        person_detected = False

        for result in results:
            boxes = result.boxes 
            
            for box in boxes:
                person_detected = True
                x1, y1, x2, y2 = box.xyxy[0].int().tolist()
                
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

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Quit by user.")
            break

    cap.release()
    process.stdin.close()
    process.wait()

if __name__ == "__main__":
    while True:
        for video_path in video_pathes:
            process_video(video_path, rtmp_url)
            