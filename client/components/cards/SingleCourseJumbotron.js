import { currencyFormatter } from "../../utils/helpers";
import { Badge, Button } from "antd";
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const SingleCourseJumbotron = ({
    course,
    showModal,
    setShowModal,
    preview,
    setPreview,
    user,
    loading,
    handleFreeEnrollment,
    handlePaidEnrollment,
    enrolled,
    setEnrolled,
}) => {
    const {
        name,
        description,
        instructor,
        updatedAt,
        lessons,
        image,
        price,
        paid,
        category,
    } = course;

    return (
        <div className="jumbotron bg-primary ps-5 pe-5">
            <div className="row">
                <div className="col-md-8">
                    <h1 className="text-light font-weight-bold">{name}</h1>
                    <p className="lead">
                        {description && description.substring(0, 160)}...
                    </p>
                    <Badge
                        count={category}
                        style={{ backgroundColor: "#03a9f4" }}
                        className="pb-4 me-2"
                    />
                    <p>Created by {instructor.name}</p>
                    <p>
                        Last updated {new Date(updatedAt).toLocaleDateString()}
                    </p>
                    <h4 className="text-light">
                        {paid
                            ? currencyFormatter({
                                  amount: price,
                                  //currency: "inr",
                                  currency: "usd",
                              })
                            : "Free"}
                    </h4>
                </div>
                <div className="col-md-4">
                    {lessons[0].video && lessons[0].video.Location ? (
                        <div
                            onClick={() => {
                                setPreview(lessons[0].video.Location);
                                setShowModal(!showModal);
                            }}
                        >
                            <ReactPlayer
                                // config={{
                                //   file: { attributes: { controlsList: "nodownload" } },
                                // }}
                                className="react-player-div"
                                url={lessons[0].video.Location}
                                light={image.Location}
                                width="100%"
                                height="255px"
                                onContextMenu={(e) => e.preventDefault()}
                                // controls
                            />
                        </div>
                    ) : (
                        <>
                            <img
                                src={image.Location}
                                alt={name}
                                className="img img-fluid"
                            />
                        </>
                    )}

                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <LoadingOutlined className="h1 text-danger" />
                        </div>
                    ) : (
                        <Button
                            className="mb-3 mt-3"
                            type="danger"
                            block
                            shape="round"
                            icon={<SafetyOutlined />}
                            size="large"
                            disabled={loading}
                            onClick={
                                paid
                                    ? handlePaidEnrollment
                                    : handleFreeEnrollment
                            }
                        >
                            {user
                                ? enrolled.status
                                    ? "Go to course"
                                    : "Enroll"
                                : "Login to enroll"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SingleCourseJumbotron;
