import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Menu } from "antd";
import Link from "next/link";
import {
    AppstoreOutlined,
    LoginOutlined,
    UserAddOutlined,
    CoffeeOutlined,
    CarryOutOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context";

const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
    const [current, setCurrent] = useState("");

    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem("user");
        const { data } = await axios.get("/api/logout");
        toast(data.message);
        router.push("/login");
    };

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            className="mb-2"
        >
            <Item
                key="/"
                onClick={(e) => setCurrent(e.key)}
                icon={<AppstoreOutlined />}
            >
                <Link href="/">
                    <a>Shedemy</a>
                </Link>
            </Item>

            {user && user.role && user.role.includes("Instructor") ? (
                <Item
                    key="/instructor/course/create"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<CarryOutOutlined />}
                >
                    <Link href="/instructor/course/create">
                        <a>Create Course</a>
                    </Link>
                </Item>
            ) : (
                <Item
                    key="/user/become-instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                >
                    <Link href="/user/become-instructor">
                        <a>Become Instructor</a>
                    </Link>
                </Item>
            )}

            {/* right */}

            {!user && (
                <>
                    <Item
                        key="/login"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<LoginOutlined />}
                    >
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </Item>

                    <Item
                        key="/register"
                        onClick={(e) => setCurrent(e.key)}
                        icon={<UserAddOutlined />}
                    >
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </Item>
                </>
            )}

            {user && user.role && user.role.includes("Instructor") && (
                <Item
                    key="/instructor"
                    onClick={(e) => setCurrent(e.key)}
                    icon={<TeamOutlined />}
                    className="float-right"
                >
                    <Link href="/instructor">
                        <a>Instructor</a>
                    </Link>
                </Item>
            )}

            {user && (
                <SubMenu
                    className="float-right"
                    icon={<CoffeeOutlined />}
                    title={user && user.name}
                >
                    <ItemGroup>
                        <Item key="/user">
                            <Link href="/user">
                                <a>Dashboard</a>
                            </Link>
                        </Item>

                        <Item onClick={logout}>Logout</Item>
                    </ItemGroup>
                </SubMenu>
            )}
        </Menu>
    );
};

export default TopNav;
