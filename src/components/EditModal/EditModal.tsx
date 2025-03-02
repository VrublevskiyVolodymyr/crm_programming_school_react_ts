import {FC, useEffect, useState} from 'react'
import {useForm, Controller, SubmitHandler} from 'react-hook-form';
import Select from 'react-select';

import {IOrder} from "../../interfaces";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {orderActions} from "../../redux";
import css from './editModal.module.css';

interface IProps {
    onClose: () => void;
    onEditOrder: (id: number, editedOrder: any) => void;
    order: IOrder;
}

interface FormValues {
    name: string;
    surname: string;
    email: string;
    phone: string | number;
    age: string | number;
    course: string;
    course_format: string;
    course_type: string;
    status: string;
    group: string;
    sum: number;
    alreadyPaid: number;
}


const EditModal: FC<IProps> = ({onClose, onEditOrder, order}) => {

    const {groups, error, isUpdate} = useAppSelector((state) => state.orderReducer);
    const dispatch = useAppDispatch();

    const {register, handleSubmit, control} = useForm<FormValues>();
    const [isGroupButtonsVisible, setGroupButtonsVisible] = useState(false);
    const [isSelectVisible, setSelectVisible] = useState(true);
    const [newGroup, setNewGroup] = useState(order?.group?.name || "");

    const [inputErrors, setInputErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (error) {
            const formattedErrors: { [key: string]: string } = {};
            error.details?.forEach((detail) => {
                const [fieldName, errorMessage] = detail.split(": ");
                const formattedFieldName = fieldName.replace(/^Field\s/, '').replace(/'/g, '').trim();
                formattedErrors[formattedFieldName] = errorMessage.trim();
            });
            setInputErrors(formattedErrors);
        } else {
            setInputErrors({});
        }
    }, [error]);


    useEffect(() => {
        let errorTimer: NodeJS.Timeout;

        if (inputErrors['group']) {
            errorTimer = setTimeout(() => {
                setInputErrors(prevErrors => ({...prevErrors, 'group': ''}));
            }, 2500);
        }

        return () => clearTimeout(errorTimer);
    }, [inputErrors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name} = e.target;

        setInputErrors((prevErrors) => {
            const updatedErrors = {...prevErrors};
            delete updatedErrors[name];
            return updatedErrors;
        });
    };


    const initialGroupValue = order.group
        ? {value: order.group.name, label: order.group.name}
        : {value: '', label: "all groups"};

    const groupOptions = [
        {value: '', label: "all groups"},
        ...groups.map((group) => ({
            value: group.name,
            label: group.name,
        })),
    ];


    const courseOptions = [
        {value: '', label: 'all courses'},
        {value: 'FS', label: 'FS'},
        {value: 'QACX', label: 'QACX'},
        {value: 'JCX', label: 'JCX'},
        {value: 'JSCX', label: 'JSCX'},
        {value: 'FE', label: 'FE'},
        {value: 'PCX', label: 'PCX'}

    ];

    const defaultCourseOptions = [
        {value: '', label: 'all courses'},
        {value: null, label: 'all courses'},
        {value: 'FS', label: 'FS'},
        {value: 'QACX', label: 'QACX'},
        {value: 'JCX', label: 'JCX'},
        {value: 'JSCX', label: 'JSCX'},
        {value: 'FE', label: 'FE'},
        {value: 'PCX', label: 'PCX'}

    ];

    const statusOptions = [
        {value: '', label: 'all statuses'},
        {value: 'New', label: 'New'},
        {value: 'In work', label: 'In work'},
        {value: 'Agree', label: 'Agree'},
        {value: 'Disagree', label: 'Disagree'},
        {value: 'Dubbing', label: 'Dubbing'}

    ];

    const defaultStatusOptions = [
        {value: '', label: 'all statuses'},
        {value: null, label: 'all statuses'},
        {value: 'New', label: 'New'},
        {value: 'In work', label: 'In work'},
        {value: 'Agree', label: 'Agree'},
        {value: 'Disagree', label: 'Disagree'},
        {value: 'Dubbing', label: 'Dubbing'}

    ];

    const courseTypeOptions = [
        {value: '', label: 'all courseTypes'},
        {value: 'pro', label: 'pro'},
        {value: 'minimal', label: 'minimal'},
        {value: 'premium', label: 'premium'},
        {value: 'incubator', label: 'incubator'},
        {value: 'vip', label: 'vip'}
    ];

    const defaultCourseTypeOptions = [
        {value: '', label: 'all courseTypes'},
        {value: null, label: 'all courseTypes'},
        {value: 'pro', label: 'pro'},
        {value: 'minimal', label: 'minimal'},
        {value: 'premium', label: 'premium'},
        {value: 'incubator', label: 'incubator'},
        {value: 'vip', label: 'vip'}
    ];

    const courseFormatOptions = [
        {value: '', label: 'all courseFormats'},
        {value: 'static', label: 'static'},
        {value: 'online', label: 'online'}
    ];

    const defaultCourseFormatOptions = [
        {value: '', label: 'all courseFormats'},
        {value: null, label: 'all courseFormats'},
        {value: 'static', label: 'static'},
        {value: 'online', label: 'online'}
    ];


    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            border: 'none',
            backgroundColor: 'transparent',
        }),
        indicatorSeparator: (provided: any) => ({
            ...provided,
            display: 'none',
        }),
        menu: (provided: any) => ({
            ...provided,
            background: "#ededed",
        }),
    };

    const onSubmit: SubmitHandler<FormValues> = async (data: { [key: string]: any }) => {
            const filteredData = Object.keys(data).reduce((acc, key) => {
                if (data[key] !== null && data[key] !== "") {
                    acc[key] = data[key];
                }
                return acc;
            }, {} as { [key: string]: any });

            onEditOrder(order.id, filteredData);

        };

       useEffect(() => {
        if (isUpdate) {
            onClose()
        }
    }, [isUpdate, onClose]);


    const handleAddGroup = (newGroupName: string) => {
        dispatch(orderActions.createGroup({name: newGroupName}));
        setNewGroup("");
    };

    const handleSelectGroup = () => {
        setSelectVisible(true);
        setGroupButtonsVisible(false);
        setNewGroup("");
    };

    const toggleGroupButtons = () => {
        setGroupButtonsVisible(!isGroupButtonsVisible);
        setSelectVisible(false);
        setNewGroup("");
    };


    const handleClose = () => {
        dispatch(orderActions.setError(null));
        onClose();
    }

    return (
        <div className={css.modal}>
            <div className={css.modalContent}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={css.scrollableContainer}>
                        <div className={css.inputGroup}>

                            <div className={css.inputRow}>
                                <label htmlFor="group">Group</label>
                                {isSelectVisible ? (
                                    <Controller
                                        key="select"
                                        control={control}
                                        name="group"
                                        render={({field}) => (
                                            <Select
                                                className={css.custom_select}
                                                classNamePrefix="select"
                                                defaultValue={initialGroupValue}
                                                styles={customStyles}
                                                maxMenuHeight={220}
                                                menuPlacement="auto"
                                                name="group"
                                                options={groupOptions}
                                                isSearchable={false}
                                                onChange={(selectedOption) => {
                                                    field.onChange(selectedOption ? selectedOption.value : '');
                                                }}
                                            />
                                        )}
                                    />

                                ) : (
                                    <input type="text" id="group" placeholder={"group"} {...register('group')}
                                           value={newGroup}
                                           onChange={(e) => {
                                               setNewGroup(e.target.value);
                                               handleInputChange(e);
                                           }}
                                           className={css.input}
                                           name="group"
                                    />
                                )}
                                {inputErrors['group'] && <p className={css.error}>{inputErrors['group']}</p>}

                                {!isGroupButtonsVisible && (
                                    <button type="button" onClick={toggleGroupButtons}
                                            className={css.add_group_button}>ADD GROUP</button>)}
                                {isGroupButtonsVisible && (
                                    <div className={css.group_buttons}>
                                        <button type="button" onClick={() => handleAddGroup(newGroup)}
                                                className={css.add_button}>ADD
                                        </button>
                                        <button type="button" onClick={handleSelectGroup}
                                                className={css.select_button}>SELECT
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="status">Status</label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            className={css.custom_select}
                                            classNamePrefix="select"
                                            defaultValue={defaultStatusOptions.find((option) => option.value === order?.status)}
                                            options={statusOptions}
                                            styles={customStyles}
                                            maxMenuHeight={250}
                                            {...field}
                                            isSearchable={false}
                                            value={statusOptions.find((option) => option.value === field.value)}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" placeholder={"name"} {...register('name')}
                                       defaultValue={order?.name || ''}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       className={css.input}/>
                                {inputErrors['name'] && <p className={css.error}>{inputErrors['name']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="sum">Sum</label>
                                <input type="number" id="sum" placeholder={"sum"} {...register('sum')}
                                       defaultValue={order?.sum || ''}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       className={css.input}/>
                                {inputErrors['sum'] && <p className={css.error}>{inputErrors['sum']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="surname">Surname</label>
                                <input type="text" id="surname" placeholder={"surname"} {...register('surname')}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       defaultValue={order?.surname || ''}
                                       className={css.input}/>
                                {inputErrors['surname'] && <p className={css.error}>{inputErrors['surname']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="alreadyPaid">Already Paid</label>
                                <input type="number" id="alreadyPaid"
                                       placeholder={"alreadyPaid"} {...register('alreadyPaid')}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       defaultValue={order?.alreadyPaid || ''}
                                       className={css.input}/>
                                {inputErrors['alreadyPaid'] &&
                                    <p className={css.error}>{inputErrors['alreadyPaid']}</p>}

                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="email">Email</label>
                                <input type="text" id="email" placeholder={"email"} {...register('email')}
                                       defaultValue={order?.email || ''}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       className={css.input}/>
                                {inputErrors['email'] && <p className={css.error}>{inputErrors['email']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="course">Course</label>
                                <Controller
                                    name="course"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            className={css.custom_select}
                                            classNamePrefix="select"
                                            defaultValue={defaultCourseOptions.find((option) => option.value === order?.course)}
                                            options={courseOptions}
                                            styles={customStyles}
                                            maxMenuHeight={250}
                                            {...field}
                                            isSearchable={false}
                                            value={courseOptions.find((option) => option.value === field.value)}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="phone">Phone</label>
                                <input type="text" id="phone" placeholder={"phone"} {...register('phone')}
                                       defaultValue={order?.phone || ''}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       className={css.input}/>
                                {inputErrors['phone'] && <p className={css.error}>{inputErrors['phone']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="course_format">Course Format</label>
                                <Controller
                                    name="course_format"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            className={css.custom_select}
                                            classNamePrefix="select"
                                            defaultValue={defaultCourseFormatOptions.find((option) => option.value === order?.course_format)}
                                            options={courseFormatOptions}
                                            styles={customStyles}
                                            maxMenuHeight={250}
                                            {...field}
                                            isSearchable={false}
                                            value={courseFormatOptions.find((option) => option.value === field.value)}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="age">Age</label>
                                <input type="text" id="age" placeholder={"age"} {...register('age')}
                                       defaultValue={order?.age || ''}
                                       onChange={(e) => {
                                           handleInputChange(e);
                                       }}
                                       className={css.input}/>
                                {inputErrors['age'] && <p className={css.error}>{inputErrors['age']}</p>}
                            </div>

                            <div className={css.inputRow}>
                                <label htmlFor="course_type">Course Type</label>
                                <Controller
                                    name="course_type"
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            className={css.custom_select}
                                            classNamePrefix="select"
                                            defaultValue={defaultCourseTypeOptions.find((option) => option.value === order?.course_type)}
                                            options={courseTypeOptions}
                                            styles={customStyles}
                                            maxMenuHeight={250}
                                            menuPlacement="top"
                                            {...field}
                                            isSearchable={false}
                                            value={courseTypeOptions.find((option) => option.value === field.value)}
                                            onChange={(selectedOption) => {
                                                field.onChange(selectedOption ? selectedOption.value : '');
                                            }}
                                        />
                                    )}
                                />
                            </div>

                        </div>
                    </div>
                    <div className={css.buttonRow}>
                        <button type="submit" onSubmit={handleSubmit(onSubmit)} className={css.submitButton}>SUBMIT</button>
                        <button type="button" onClick={handleClose} className={css.closeButton}>CLOSE</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export {EditModal};
