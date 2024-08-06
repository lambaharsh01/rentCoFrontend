// ImageCropper.jsx
import "./imageCropper.css";
import { useRef, useState } from "react";
import Cropper from "react-easy-crop";

import { toast } from "react-toastify";

import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";

const ImageCropper = ({
  onCropComplete,
  ratio,
  height,
  width,
  value,
  iconSize,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [compression, setCompression] = useState(0.4);

  const uploadInconSize = `${iconSize ?? "text-xl"}`;

  const fileInput = useRef(null);

  const [image, setImage] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState(null);

  function handleInput(element) {
    if (!element.currentTarget.files.length)
      return toast.error("No image recived");

    const reader = new FileReader();
    reader.onload = function (e) {
      setImage(reader.result);
      setShowModal(true);
    };
    reader.readAsDataURL(element.currentTarget.files[0]);
  }

  //CROP CONFIRMATION
  const onCropDone = (compressionLevel) => {
    let imgCroppedArea = croppedArea;
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");
    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      // Convert the canvas content to a data URL (JPEG format)
      const dataURL = canvasEle.toDataURL("image/jpeg", compressionLevel);

      const payloadSizeBytes = dataURL.length;
      const payloadSizeMB = payloadSizeBytes / (1024 * 1024);

      let formattedSize;
      if (payloadSizeMB < 1) {
        const payloadSizeKB = (payloadSizeBytes / 1024).toFixed(2);
        formattedSize = `${payloadSizeKB} KB`;
      } else {
        formattedSize = `${payloadSizeMB.toFixed(2)} MB`;
      }

      toast.info(`file size is ${formattedSize}`);

      setShowModal(false);
      setTimeout(() => {
        setCompression(0.5);
        fileInput.current.value = "";
      }, 1000);

      if (payloadSizeMB > 1)
        return toast.error(
          "Image exceed the threshold of 1mb please select a lighter image"
        );

      onCropComplete(dataURL);
    };
  };

  return (
    <>
      <div className="image-container">
        <img src={value} style={{ height, width }} alt="cropImage" />
        <FaCloudUploadAlt
          className={`upload-icon text-slate-500 ${uploadInconSize}`}
          onClick={() => {
            console.log(fileInput.current);
            if (fileInput.current) fileInput.current.click();
          }}
        />
      </div>
      <input
        ref={fileInput}
        className="d-none"
        type="file"
        accept="image/*"
        onChange={handleInput}
      />

      <div
        className={`modal modal-lg ${
          showModal ? "show d-block modal-open blurModalBackground" : "d-none"
        }`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body p-2 moda_height_for_the_crop relative">
              <div className="absolute right-0 pe-4">
                <span className="font-medium text-xs">
                  Compress
                  <select
                    className="ms-1"
                    value={compression}
                    onChange={(e) => setCompression(e.currentTarget.value)}
                  >
                    <option value={0.9}>10%</option>
                    <option value={0.8}>20%</option>
                    <option value={0.7}>30%</option>
                    <option value={0.6}>40%</option>
                    <option value={0.5}>50%</option>
                    <option value={0.4}>60%</option>
                    <option value={0.3}>70%</option>
                    <option value={0.2}>80%</option>
                    <option value={0.1}>90%</option>
                  </select>
                </span>
              </div>
              <h4 className="text-center">CROP</h4>
              <p className="text-center font-medium">
                Drag and adjust the box to select the area you want to keep.
              </p>

              <div className="w-100 d-flex justify-content-around">
                <ImCross
                  className="modal_icons text-danger"
                  onClick={() => setShowModal(false)}
                />
                <FaCheck
                  className="modal_icons text-success"
                  onClick={() => {
                    onCropDone(compression);
                  }}
                />
              </div>
              <div>
                <Cropper
                  image={image}
                  aspect={ratio}
                  crop={crop}
                  zoom={zoom}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(
                    croppedAreaPercentage,
                    croppedAreaPixels
                  ) => {
                    setCroppedArea(croppedAreaPixels);
                  }}
                  style={{
                    containerStyle: {
                      width: "96%",
                      height: "auto",
                      backgroundColor: "darkgray",
                      marginTop: "150px",
                      marginLeft: "2%",
                      marginRight: "2%",
                      marginBottom: "10px",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
