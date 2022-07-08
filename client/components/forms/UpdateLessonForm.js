import { Button, Select, Progress, Switch } from "antd";
import ReactPlayer from "react-player";

const { Option } = Select;

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleVideo,
  handleUpdateLesson,
  progress,
  uploading,
  uploadVideoButtonText,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder="Title"
          autoFocus
          required
        />
        <textarea
          cols="7"
          rows="7"
          value={current.content}
          className="form-control mt-3"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          placeholder="Content"
        ></textarea>
        <div className="d-flex flex-column justify-content-center">
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              <ReactPlayer
                config={{
                  file: { attributes: { controlsList: "nodownload" } },
                }}
                onContextMenu={(e) => e.preventDefault()}
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}

          <label
            style={{ textAlign: "left" }}
            className="btn btn-dark w-100 text-left mt-3"
          >
            {uploadVideoButtonText}
            <input
              type="file"
              name="image"
              onChange={handleVideo}
              accept="video/*"
              hidden
            />
          </label>
        </div>
        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <div className="d-flex justify-content-between">
          <span className="pt-3 ">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            // defaultChecked={current.free_preview}
            checked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
