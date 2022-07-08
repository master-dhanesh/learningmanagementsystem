import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRouter from "../../../components/routes/UserRoute";
import { useRouter } from "next/router";
import axios from "axios";

const StripeSuccess = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) successRequest();
    }, [id]);

    const successRequest = async () => {
        const { data } = await axios.get(`/api/stripe-success/${id}`);
        router.push(`/user/course/${data.course.slug}`);
    };

    return (
        <UserRouter showNav={false}>
            <div className="row text-center">
                <div className="col-md-9 pb-5">
                    <div className="d-flex justify-content-center p-5">
                        <SyncOutlined className="display-1 text-danger p-5" />
                    </div>
                </div>
                <div className="col-md-3"></div>
            </div>
        </UserRouter>
    );
};

export default StripeSuccess;