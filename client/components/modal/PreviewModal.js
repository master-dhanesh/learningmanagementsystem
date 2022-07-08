import { Modal } from "antd";
import ReactPlayer from "react-player";

const PreviewModal = ({ showModal, setShowModal, preview }) => {
  return (
    <>
      <Modal
        title="Course Preview"
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        width={720}
        footer={null}
      >
        <div className="wrapper">
          <ReactPlayer
            className="react-player-div"
            config={{
              file: { attributes: { controlsList: "nodownload" } },
            }}
            url={preview}
            playing={showModal}
            controls={true}
            width="100%"
            height="100%"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      </Modal>
    </>
  );
};

export default PreviewModal;
