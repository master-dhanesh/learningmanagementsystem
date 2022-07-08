import { Button, Select, Progress, Avatar, Badge, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

const { Option } = Select;

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          value={values.title}
          placeholder="Title"
          autoFocus
          required
        />

        <textarea
          cols="7"
          rows="7"
          value={values.content}
          className="form-control mt-3"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          placeholder="Content"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label
            style={{ textAlign: "left" }}
            className="btn btn-dark w-100 text-left mt-3"
          >
            {uploadButtonText}
            <input
              type="file"
              name="image"
              onChange={handleVideo}
              accept="video/*"
              hidden
            />
          </label>

          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleVideoRemove} className="pt-1 ps-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 cursor-pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          type="primary"
          size="large"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
