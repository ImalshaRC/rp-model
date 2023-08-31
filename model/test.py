import os
from cvlib.object_detection import YOLO
import cv2
import json
import sys


def perform_object_detection(image_path, output_size=(680, 460)):
    # Load the image
    img = cv2.imread(image_path)

    # Resize the image
    img = cv2.resize(img, output_size)

    # Get the directory of the script
    script_directory = os.path.dirname(os.path.abspath(__file__))

    # Construct paths to required files
    weights = os.path.join(script_directory, "yolov4-tiny-custom_last.weights")
    config = os.path.join(script_directory, "yolov4-tiny-custom.cfg")
    labels = os.path.join(script_directory, "obj.names")

    # Load YOLO model
    yolo = YOLO(weights, config, labels)

    # Perform object detection
    bbox, label, conf = yolo.detect_objects(img)

    results = []
    if bbox:
        for i in range(len(label)):
            result = {"label": label[i], "bbox": bbox[i], "confidence": conf[i]}
            results.append(result)

    return results


if __name__ == "__main__":
    if len(sys.argv) != 2:
        # print("Usage: python your_python_script.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    detection_results = perform_object_detection(image_path)
    print(json.dumps(detection_results))
