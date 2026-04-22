### Dependencies Needed
    - Rtmp module
        - sudo apt install libnginx-mod-rtmp
    

    ffmpeg -re -i "Test_video.mpk" -vcodec mpeg4 -f mpegts rtmp://localhost:1935/

    ffmpeg -re -i Test_video.mkv -c:v copy -c:a copy -f flv rtmp://localhost:1935/live/test

    - Commands for streaming through camera: ffmpeg -f v4l2 -i /dev/video0 -f pulse -i default -c:v libx264 -preset veryfast -b:v 2500k -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -f flv rtmp://localhost:1935/live/test

    ffmpeg -thread_queue_size 512 -f v4l2 -i /dev/video0 -thread_queue_size 512 -f pulse -i default -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -f flv rtmp://10.xx.xx.xx/live/test

    ffmpeg -thread_queue_size 512 -f v4l2 -i /dev/video0 -thread_queue_size 512 -f pulse -i default -c:v libx264 -preset ultrafast -tune zerolatency -c:a aac -f flv rtmp://YOUR_IP/live/test

    - Commands for streaming through camera: ffmpeg -f v4l2 -i /dev/video0 -f pulse -i default -c:v libx264 -preset veryfast -b:v 2500k -maxrate 2500k -bufsize 5000k -pix_fmt yuv420p -g 60 -c:a aac -b:a 128k -f flv "rtmp://YOUR_SERVER_URL/YOUR_STREAM_KEY"
