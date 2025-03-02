import React, {FC, useState, useEffect} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import qs from 'qs';
import {ParsedQs} from 'qs';
import {FaUndo, FaFileExcel} from 'react-icons/fa';
import Select from 'react-select';

import {useAppDispatch, useAppSelector} from '../../hooks';
import {orderActions} from "../../redux";
import css from './filter.module.css';

interface IProps {
    onFilter: (queryParams: string) => void;
    onFilterExcel: (queryParams: string) => void;
    onReset: () => void;
}

interface QueryParams {
    [key: string]: boolean | string | number | readonly string[] | undefined | null;
}

interface FilterFields {
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
    startDate: string;
    endDate: string;
    my: boolean | string;
}


const FilterComponent: FC<IProps> = ({onFilter, onReset, onFilterExcel}) => {
    const queryData = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    const orderBy = queryData.order as string || "-id";

    const [filterValues, setFilterValues] = useState<FilterFields>({
        name: '',
        surname: '',
        email: '',
        phone: '',
        age: '',
        course: '',
        course_format: '',
        course_type: '',
        status: '',
        group: '',
        startDate: '',
        endDate: '',
        my: false,
    });

    const {groups, shouldResetFilters} = useAppSelector((state) => state.orderReducer);
    const [queryParams, setQueryParams] = useState<string>('');
    const dispatch = useAppDispatch();
    const [typeTimerId, setTypeTimerId] = useState<NodeJS.Timeout | null>(null);
    const {control, handleSubmit, reset, getValues} = useForm<FilterFields>();

    const groupOptions = [
        {value: '', label: 'all groups'},
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
        {value: 'PCX', label: 'PCX'},
    ];

    const statusOptions = [
        {value: '', label: 'all statuses'},
        {value: 'In work', label: 'In work'},
        {value: 'New', label: 'New'},
        {value: 'Agree', label: 'Agree'},
        {value: 'Disagree', label: 'Disagree'},
    ];

    const courseTypeOptions = [
        {value: '', label: 'all courseTypes'},
        {value: 'pro', label: 'pro'},
        {value: 'minimal', label: 'minimal'},
        {value: 'premium', label: 'premium'},
        {value: 'incubator', label: 'incubator'},
        {value: 'vip', label: 'vip'},
    ];

    const courseFormatOptions = [
        {value: '', label: 'all courseFormats'},
        {value: 'static', label: 'static'},
        {value: 'online', label: 'online'},
    ];

    const customStyles = {
        container: (provided: any) => ({
            ...provided,
            border: '1px solid var(--button-color)',
        }),
        control: (provided: any, state: any) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--button-color)'
            },
            backgroundColor: 'transparent',
        }),
        indicatorSeparator: (provided: any) => ({
            ...provided,
            display: 'none',
        }),
        menu: (provided: any) => ({
            ...provided,
            background: '#ededed',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'var(--active-color)' : 'transparent',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
                backgroundColor: 'var(--button-color)',
            },
        }),
    };


    const sendQuery = (data: FilterFields) => {
        const queryParams: QueryParams = {
            page: 1,
            ...queryData,
            ...data,
            my: typeof data.my === 'boolean' && data.my ? data.my : '',
        };

        if (!queryParams.order && orderBy) {
            queryParams.order = orderBy;
        }

        for (const key in queryParams) {
            if (queryParams[key] === '' || queryParams[key] === null) {
                delete queryParams[key];
            }
        }

        const queryString = qs.stringify(queryParams, { encode: false });
        window.history.pushState({}, '', `?${queryString}`);

        onFilter(queryString);
        setQueryParams(queryString);
    };


    const onResetHandler = () => {
        const updatedFilterValues: FilterFields = {
            name: '',
            surname: '',
            email: '',
            phone: '',
            age: '',
            course: '',
            course_format: '',
            course_type: '',
            status: '',
            group: '',
            startDate: '',
            endDate: '',
            my: false
        };

        const defaultGroup = groupOptions.find((option) => option.value === null);
        if (defaultGroup) {
            const selectedValue = defaultGroup.value;
            handleFieldChangeAndSendQuery('group', selectedValue || '');
        }

        setFilterValues(updatedFilterValues);
        reset(updatedFilterValues);
        onReset();
    };


    useEffect(() => {
        if (orderBy !== null && shouldResetFilters) {
            const updatedFilterValues: FilterFields = {
                name: '',
                surname: '',
                email: '',
                phone: '',
                age: '',
                course: '',
                course_format: '',
                course_type: '',
                status: '',
                group: '',
                startDate: '',
                endDate: '',
                my: false,
            };

            reset(updatedFilterValues);
            dispatch(orderActions.setShouldResetFilters(false));
        }
    }, [reset, orderBy, shouldResetFilters, dispatch]);


    useEffect(() => {
        const queryData = qs.parse(window.location.search, {ignoreQueryPrefix: true});
        reset(queryData);
        setQueryParams(qs.stringify(queryData, {encode: false}));
    }, [reset, setQueryParams]);


    const updateQueryParams = (params: { [key: string]: any }) => {
        const queryParams = qs.stringify(params, {encode: false});
        window.history.pushState({}, '', `${queryParams}`);
    };

    const handleFieldChangeAndSendQuery = (fieldKey: keyof FilterFields, selectedValue: string) => {
        const updatedFilterValues = {...filterValues, [fieldKey]: selectedValue};
        setFilterValues(updatedFilterValues);
        updateQueryParams(updatedFilterValues);
        sendQuery(updatedFilterValues);
    };

    const onSubmit: SubmitHandler<FilterFields> = (data) => {
        const queryData = getValues();
        const queryParams = qs.stringify(queryData, {encode: false});
        onFilter(queryParams);
        setFilterValues(data);
    };

    const handleBooleanFieldChangeAndSendQuery = (fieldKey: keyof FilterFields, selectedValue: boolean) => {
        const updatedFilterValues = {...filterValues, [fieldKey]: selectedValue};
        setFilterValues(updatedFilterValues);
        updateQueryParams(updatedFilterValues);
        sendQuery(updatedFilterValues);
    };
    const handleFieldChange = (fieldKey: keyof FilterFields, selectedValue: string | boolean) => {

        setFilterValues((prevValues) => ({
            ...prevValues,
            [fieldKey]: selectedValue,
        }));

        clearTimeout(typeTimerId as any);

        const timerId = setTimeout(() => {
            if (typeof selectedValue === 'string') {
                handleFieldChangeAndSendQuery(fieldKey, selectedValue);
            } else {
                handleBooleanFieldChangeAndSendQuery(fieldKey, selectedValue);
            }
        }, 500);

        setTypeTimerId(timerId);
    };


    function mapQueryDataToFilterFields(queryData: ParsedQs): FilterFields {
        return {
            name: typeof queryData.name === 'string' ? queryData.name : '',
            surname: typeof queryData.surname === 'string' ? queryData.surname : '',
            email: typeof queryData.email === 'string' ? queryData.email : '',
            phone: typeof queryData.phone === 'string' ? queryData.phone : '',
            age: typeof queryData.age === 'string' ? queryData.age : '',
            course: typeof queryData.course === 'string' ? queryData.course : '',
            course_format: typeof queryData.course_format === 'string' ? queryData.course_format : '',
            course_type: typeof queryData.course_type === 'string' ? queryData.course_type : '',
            status: typeof queryData.status === 'string' ? queryData.status : '',
            group: typeof queryData.group === 'string' ? queryData.group : '',
            startDate: typeof queryData.startDate === 'string' ? queryData.startDate : '',
            endDate: typeof queryData.endDate === 'string' ? queryData.endDate : '',
            my: queryData.my === 'true'
        };
    }

    const myValue = filterValues.my;

    useEffect(() => {
        const queryData = qs.parse(window.location.search, {ignoreQueryPrefix: true});
        const filterFields = mapQueryDataToFilterFields(queryData);
        setFilterValues(filterFields);
    }, [myValue]);


    useEffect(() => {
        const updatedFilterValues: FilterFields = {
            name: "",
            surname: "",
            email: "",
            phone: "",
            age: "",
            course: "",
            course_format: "",
            course_type: "",
            status: "",
            group: "",
            startDate: "",
            endDate: "",
            my: myValue,
        };

        if (orderBy !== null && shouldResetFilters) {
            reset(updatedFilterValues);
            dispatch(orderActions.setShouldResetFilters(false));
        }
    }, [reset, orderBy, shouldResetFilters, dispatch, myValue]);


    const handleFilterExcel = () => {
        onFilterExcel(queryParams);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={css.container}>
                <div className={css.inputs}>
                    <div className={css.inputRow}>
                        <Controller
                            name="status"
                            control={control}
                            render={({field}) => (
                                <Select
                                    className={css.custom_select}
                                    classNamePrefix="select"
                                    defaultValue={statusOptions[0]}
                                    options={statusOptions}
                                    styles={customStyles}
                                    maxMenuHeight={250}
                                    {...field}
                                    isSearchable={false}
                                    value={statusOptions.find((option) => option.value === (field.value !== undefined ? field.value : ''))}
                                    onChange={(selectedOption) => {
                                        const selectedValue = selectedOption ? selectedOption.value : '';
                                        field.onChange(selectedValue || '');
                                        handleFieldChangeAndSendQuery('status', selectedValue || '');
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="text"
                                    placeholder="name"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('name', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="surname"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="text"
                                    placeholder="surname"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('surname', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="text"
                                    placeholder="email"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('email', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <Controller
                        key="select"
                        control={control}
                        name="group"
                        render={({field}) => (
                            <Select
                                className={css.custom_select}
                                classNamePrefix="select"
                                defaultValue={groupOptions[0]}
                                styles={customStyles}
                                maxMenuHeight={220}
                                menuPlacement="auto"
                                options={groupOptions}
                                {...field}
                                isSearchable={false}
                                value={groupOptions.find((option) => option.value === (field.value !== undefined ? field.value : ''))}
                                onChange={(selectedOption) => {
                                    const selectedValue = selectedOption ? selectedOption.value : '';
                                    field.onChange(selectedValue || '');
                                    handleFieldChangeAndSendQuery('group', selectedValue || '');
                                }}
                            />
                        )}
                    />

                    <div className={css.inputRow}>
                        <Controller
                            name="course"
                            control={control}
                            render={({field}) => (
                                <Select
                                    className={css.custom_select}
                                    classNamePrefix="select"
                                    defaultValue={courseOptions[0]}
                                    options={courseOptions}
                                    styles={customStyles}
                                    maxMenuHeight={250}
                                    {...field}
                                    isSearchable={false}
                                    value={courseOptions.find((option) => option.value === (field.value !== undefined ? field.value : ''))}
                                    onChange={(selectedOption) => {
                                        const selectedValue = selectedOption ? selectedOption.value : '';
                                        field.onChange(selectedValue || '');
                                        handleFieldChangeAndSendQuery('course', selectedValue || '');
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="text"
                                    placeholder="phone"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('phone', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="course_format"
                            control={control}
                            render={({field}) => (
                                <Select
                                    className={css.custom_select}
                                    classNamePrefix="select"
                                    defaultValue={courseFormatOptions[0]}
                                    options={courseFormatOptions}
                                    styles={customStyles}
                                    maxMenuHeight={250}
                                    {...field}
                                    isSearchable={false}
                                    value={courseFormatOptions.find((option) => option.value === (field.value !== undefined ? field.value : ''))}
                                    onChange={(selectedOption) => {
                                        const selectedValue = selectedOption ? selectedOption.value : '';
                                        field.onChange(selectedValue || '');
                                        handleFieldChangeAndSendQuery('course_format', selectedValue || '');
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="age"
                            control={control}
                            defaultValue=''
                            render={({field}) => (
                                <input
                                    type="number"
                                    placeholder="age"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('age', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="course_type"
                            control={control}
                            render={({field}) => (
                                <Select
                                    className={css.custom_select}
                                    classNamePrefix="select"
                                    defaultValue={courseTypeOptions[0]}
                                    options={courseTypeOptions}
                                    styles={customStyles}
                                    maxMenuHeight={250}
                                    {...field}
                                    isSearchable={false}
                                    value={courseTypeOptions.find((option) => option.value === (field.value !== undefined ? field.value : ''))}
                                    onChange={(selectedOption) => {
                                        const selectedValue = selectedOption ? selectedOption.value : '';
                                        field.onChange(selectedValue || '');
                                        handleFieldChangeAndSendQuery('course_type', selectedValue || '');
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div className={css.inputRow}>
                        <Controller
                            name="startDate"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="date"
                                    placeholder="startDate"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('startDate', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>

                    <div className={css.inputRow}>
                        <Controller
                            name="endDate"
                            control={control}
                            defaultValue=""
                            render={({field}) => (
                                <input
                                    type="date"
                                    placeholder="endDate"
                                    {...field}
                                    className={css.input}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        handleFieldChange('endDate', e.target.value);
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>

                <div className={css.buttons}>
                    <div className={css.checkbox}>
                        <label>My</label>
                        <Controller
                            name="my"
                            control={control}
                            render={({field}) => (
                                <input
                                    type="checkbox"
                                    id="my-checkbox"
                                    className={css.checkboxInput}
                                    onChange={(e) => {
                                        field.onChange(e.target.checked);
                                        handleFieldChange('my', e.target.checked);
                                    }}
                                    checked={Boolean(field.value)}
                                />
                            )}
                        />
                        <label htmlFor="my-checkbox" className={css.checkboxLabel}></label>
                    </div>
                    <button type="button" onClick={(e) => {
                        e.preventDefault();
                        onResetHandler();
                    }}>
                        <FaUndo/>
                    </button>
                    <button type="button" onClick={handleFilterExcel}>
                        <FaFileExcel/>
                    </button>
                </div>
            </div>
        </form>
    );
};

export {FilterComponent};