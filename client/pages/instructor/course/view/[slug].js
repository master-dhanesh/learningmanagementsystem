import axios from "axios";
import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import { useRouter } from "next/router";
import Link from "next/Link";
import {
    CheckOutlined,
    EditOutlined,
    UploadOutlined,
    QuestionOutlined,
    CloseOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const { Item } = List;

const CourseView = () => {
    const [course, setCourse] = useState({});
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: "",
        content: "",
        video: {},
    });
    const [uploading, setUploading] = useState(false);
    const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
    const [progress, setProgress] = useState(0);
    // student count
    const [students, setStudents] = useState(0);

    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadCourse();
    }, []);

    useEffect(() => {
        course && studentCount();
    }, [course]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
        setCourse(data);
    };

    const studentCount = async () => {
        const { data } = await axios.post(`/api/instructor/student-count`, {
            courseId: course._id,
        });
        console.log("STUDENT COUNT => ", data);
        setStudents(data);
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                `/api/course/lesson/${slug}/${course.instructor._id}`,
                values
            );
            setValues({ ...values, title: "", content: "", video: {} });
            setVisible(false);
            setUploadButtonText("Upload Video");
            setCourse(data);
            setProgress(0);
            setUploading(false);
            toast("Lesson added");
        } catch (err) {
            console.log(err);
            toast("Lesson add failed");
        }
    };

    const handleVideo = async (e) => {
        try {
            const file = e.target.files[0];
            setUploadButtonText(file.name);
            setUploading(true);

            const videoData = new FormData();
            videoData.append("video", file);

            const { data } = await axios.post(
                `/api/course/video-upload/${course.instructor._id}`,
                videoData,
                {
                    onUploadProgress: (e) => {
                        setProgress(Math.round(100 * e.loaded) / e.total);
                    },
                }
            );

            console.log(data);
            setValues({ ...values, video: data });
            setUploading(false);
        } catch (error) {
            toast("Video upload failed");
        }
    };

    const handleVideoRemove = async (e) => {
        // console.log(values.video);
        try {
            setUploading(true);
            const { data } = await axios.post(
                `/api/course/video-remove/${course.instructor._id}`,
                values.video
            );
            console.log(data);
            setValues({ ...values, video: {} });
            setUploading(false);
            setUploadButtonText("Upload another video");
        } catch (err) {
            console.log(err);
            setUploading(false);
            toast("Remove video failed. Try again");
        }
    };

    const handlePublish = async (e, courseId) => {
        try {
            let answer = window.confirm(
                "Once you publih your course, it will be live in the marketplace for users to enroll"
            );
            if (!answer) return;
            const { data } = await axios.put(`/api/course/publish/${courseId}`);
            setCourse(data);
            toast("Congrats! Your course is live now");
        } catch (err) {
            toast("Course publish failed. Try again");
        }
    };

    const handleUnpublish = async (e, courseId) => {
        try {
            let answer = window.confirm(
                "Once you unpublih your course, it will not be available for users to enroll"
            );
            if (!answer) return;
            const { data } = await axios.put(
                `/api/course/unpublish/${courseId}`
            );
            setCourse(data);
            toast("Your course is unpublished");
        } catch (err) {
            toast("Course unpublish failed. Try again");
        }
    };

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
                {course && (
                    <div className="container-fluid pt-1">
                        <div className="media pt-2 row">
                            <Avatar
                                size={80}
                                src={
                                    course.image
                                        ? course.image.Location
                                        : "/course.png"
                                }
                            />

                            <div className="media-body ps-2 col">
                                <div className="row">
                                    <div className="col">
                                        <Link
                                            href={`/instructor/course/view/${course.slug}`}
                                            className="cursor-pointer"
                                        >
                                            <a className="mt-2 text-primary">
                                                <h5 className="pt-2">
                                                    {course.name}
                                                </h5>
                                            </a>
                                        </Link>
                                        <p style={{ marginTop: "-10px" }}>
                                            {course &&
                                                course.lessons &&
                                                course.lessons.length}{" "}
                                            Lessons
                                        </p>
                                        <p
                                            style={{
                                                marginTop: "-15px",
                                                fontSize: "10px",
                                            }}
                                        >
                                            {course.category}
                                        </p>
                                    </div>
                                    <div className="col-md-3 mt-3 text-center">
                                        <Tooltip
                                            title={`${students.length} Enrolled`}
                                        >
                                            <UserSwitchOutlined className="h5 cursor-pointer text-info me-4" />
                                        </Tooltip>

                                        <Tooltip title="Edit">
                                            <EditOutlined
                                                onClick={() =>
                                                    router.push(
                                                        `/instructor/course/edit/${slug}`
                                                    )
                                                }
                                                className="h5 cursor-pointer text-warning me-4"
                                            />
                                        </Tooltip>

                                        {course.lessons &&
                                        course.lessons.length < 5 ? (
                                            <Tooltip title="Min 5 lessons required to publish">
                                                <QuestionOutlined className="h5 cursor-pointer text-danger" />
                                            </Tooltip>
                                        ) : course.published ? (
                                            <Tooltip title="Unpublish">
                                                <CloseOutlined
                                                    onClick={(e) =>
                                                        handleUnpublish(
                                                            e,
                                                            course._id
                                                        )
                                                    }
                                                    className="h5 cursor-pointer text-danger"
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Publish">
                                                <CheckOutlined
                                                    onClick={(e) =>
                                                        handlePublish(
                                                            e,
                                                            course._id
                                                        )
                                                    }
                                                    className="h5 cursor-pointer text-success"
                                                />
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col">
                                <ReactMarkdown children={course.description} />
                            </div>
                        </div>
                        <div className="row">
                            <Button
                                onClick={() => setVisible(true)}
                                className="col-md-6 offset-md-3 text-center"
                                type="primary"
                                shape="round"
                                icon={<UploadOutlined />}
                                size="large"
                            >
                                Add Lesson
                            </Button>
                        </div>

                        <br />

                        <Modal
                            title="+ Add Lesson"
                            centered
                            visible={visible}
                            onCancel={() => setVisible(false)}
                            footer={null}
                        >
                            <AddLessonForm
                                values={values}
                                setValues={setValues}
                                handleAddLesson={handleAddLesson}
                                uploading={uploading}
                                uploadButtonText={uploadButtonText}
                                handleVideo={handleVideo}
                                progress={progress}
                                handleVideoRemove={handleVideoRemove}
                            />
                        </Modal>

                        <hr />

                        <div className="row pb-5">
                            <div className="col lesson-list">
                                <h4>
                                    {course &&
                                        course.lessons &&
                                        course.lessons.length}{" "}
                                    Lessons
                                </h4>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={course && course.lessons}
                                    renderItem={(item, index) => (
                                        <Item>
                                            <Item.Meta
                                                avatar={
                                                    <Avatar>{index + 1}</Avatar>
                                                }
                                                title={item.title}
                                            ></Item.Meta>
                                        </Item>
                                    )}
                                ></List>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </InstructorRoute>
    );
};

export default CourseView;
