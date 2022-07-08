import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import {
    PlayCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    CheckCircleFilled,
    MinusCircleFilled,
} from "@ant-design/icons";

const { Item } = Menu;
const SingleCourse = () => {
    const [clicked, setClicked] = useState(-1);
    const [collapsed, setCollapsed] = useState(false);

    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({ lessons: [] });
    const [completedLessons, setCompletedLessons] = useState([]);

    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        loadCourse();
    }, []);

    useEffect(() => {
        if (course) loadComplatedLessons();
    }, [course, completedLessons]);

    const loadComplatedLessons = async () => {
        const { data } = await axios.post(`/api/list-completed`, {
            courseId: course._id,
        });
        // console.log("COMPLETED LESSONS => ", data);
        setCompletedLessons(data);
    };

    const loadCourse = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/course/${slug}`);
            setCourse(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const markCompleted = async () => {
        const { data } = await axios.post(`/api/mark-completed`, {
            courseId: course._id,
            lessonId: course.lessons[clicked]._id,
        });
        console.log(data);
        setCompletedLessons([...completedLessons, course.lessons[clicked._id]]);
    };

    const markIncompleted = async () => {
        try {
            const { data } = await axios.post(`/api/mark-incomplete`, {
                courseId: course._id,
                lessonId: course.lessons[clicked]._id,
            });
            console.log(data);
            const all = completedLessons;
            const index = all.indexOf(course.lessons[clicked]._id);
            if (index > -1) {
                all.splice(index, 1);
                setCompletedLessons(all);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <StudentRoute>
            <div className="row">
                <div style={{ maxWidth: 320 }}>
                    <Button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-primary mt-1 btn-block mb-2"
                    >
                        {createElement(
                            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined
                        )}{" "}
                        {!collapsed && "Lessons"}
                    </Button>
                    <Menu
                        defaultSelectedKeys={[clicked]}
                        inlineCollapsed={collapsed}
                        style={{ height: "80vh", overflow: "auto" }}
                    >
                        {course.lessons.map((lesson, index) => (
                            <Item
                                onClick={() => setClicked(index)}
                                key={index}
                                icon={<Avatar>{index + 1}</Avatar>}
                            >
                                {lesson.title.substring(0, 30)}{" "}
                                {completedLessons.includes(lesson._id) ? (
                                    <CheckCircleFilled
                                        className="float-end text-primary ml-2"
                                        style={{ marginTop: "10px" }}
                                    />
                                ) : (
                                    <MinusCircleFilled
                                        className="float-end text-danger ml-2"
                                        style={{ marginTop: "10px" }}
                                    />
                                )}
                            </Item>
                        ))}
                    </Menu>
                </div>
                <div className="col">
                    {clicked !== -1 ? (
                        <>
                            <div className="col alert alert-primary jumborton">
                                <strong>
                                    {course.lessons[clicked].title.substring(
                                        0,
                                        30
                                    )}
                                </strong>
                                {completedLessons.includes(
                                    course.lessons[clicked]._id
                                ) ? (
                                    <span
                                        className="float-end cursor-pointer"
                                        onClick={markIncompleted}
                                    >
                                        Mark as incompleted
                                    </span>
                                ) : (
                                    <span
                                        className="float-end cursor-pointer"
                                        onClick={markCompleted}
                                    >
                                        Mark as completed
                                    </span>
                                )}
                            </div>

                            {course.lessons[clicked].video &&
                                course.lessons[clicked].video.Location && (
                                    <>
                                        <div className="wrapper">
                                            <ReactPlayer
                                                className="player"
                                                url={
                                                    course.lessons[clicked]
                                                        .video.Location
                                                }
                                                width="95%"
                                                height="100%"
                                                controls
                                                onEnded={markCompleted}
                                            />
                                        </div>
                                    </>
                                )}
                            <ReactMarkdown
                                children={course.lessons[clicked].content}
                                className="single-post"
                            />
                        </>
                    ) : (
                        <div className="d-flex justify-content-center p-5">
                            <div className="text-center p-5">
                                <PlayCircleOutlined className="text-primary display-1 p-5" />
                                <p className="lead">
                                    Click on the lessons to start learning
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StudentRoute>
    );
};

export default SingleCourse;
