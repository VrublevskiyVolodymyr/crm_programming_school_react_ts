import {FC} from 'react';

import {Orders} from "../../components";

interface IProps {

}

const OrderPage: FC<IProps> = () => {
    return (
        <div>
            <Orders/>
        </div>
    );
};

export {OrderPage};