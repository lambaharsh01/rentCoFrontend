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
  const onCropDone = () => {
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
      const dataURL = canvasEle.toDataURL("image/jpeg");
      onCropComplete(dataURL);
      setShowModal(false);
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
            <div className="modal-body p-2 moda_height_for_the_crop">
              <h4 className="text-center">CROP</h4>
              <p className="text-center small_text_when_needed">
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
                    onCropDone();
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