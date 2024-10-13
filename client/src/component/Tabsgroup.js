import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
const Tabsgroup = ({ students, handleOpenModal }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Compeleted" {...a11yProps(0)} style={{ zIndex: '10' }} />
                        <Tab label="Pending" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    {students.length > 0 ? (
                        students.filter((studend)=> studend.attempted === true)
                        .reduce((acc, current)=>{
                            const x = acc.find(item =>item.assessmentId === current.assessmentId);
                            if(!x){
                                return acc.concat([current]);
                            }else{
                                return acc;
                            }
                        },[])
                        .map(item => (
                            item.attempted ?(
                                <div key={item.studentId} className="bg-white shadow-md rounded-lg p-4 my-4">
                                    <button className='float-right' onClick={() => handleOpenModal(item)}>
                                        <Box className="float-right" sx={{ '& > :not(style)': { m: 1 } }}>
                                            <Fab size="small" color="secondary" aria-label="edit">
                                                <EditIcon className='float-right' size={20} />
                                            </Fab>
                                        </Box>
                                    </button>
                                    <span className="font-semibold text-sm">
                                        Date: {new Date(item.createdAt).toLocaleDateString() || 'No date'}
                                    </span>
                                    <h2 className="text-sm font-semibold mb-2">Student Role: {capitalizeFirstLetter(item.studentId.role)}</h2>
                                    <h2 className="text-sm font-semibold mb-2">Student Name: {item.studentId.fullName}</h2>
                                    <h2 className="text-sm font-semibold mb-2">Email: {item.studentId.emailId}</h2>
                                    <span className="mt-5">
                                        <div className="font-semibold text-sm">Assessment Title: {item.assessmentId.title}</div>
                                        <div className="font-semibold text-sm">Score: {item.score || "0"}/{item.total || 0}</div>
                                        <div className="font-semibold text-sm">Feedback: {item.feedback || 'No feedback'}</div>
                                    </span>
                                </div>
                            ) : null // Do not render anything for students who haven't attempted
                        ))
                    ) : (
                        <p className="text-sm">Some students have not attempted assessments.</p>
                    )}
                </CustomTabPanel>


                <CustomTabPanel value={value} index={1}>
                    {students.length > 0 ? (
                        students.some(item => !item.attempted) ? ( // Check if there are any non-attempted students
                            students.map(item => (
                                !item.attempted && ( // Render only non-attempted students
                                    <div key={item.studentId} className="bg-white shadow-md rounded-lg p-4 my-4">
                                        <span className="font-semibold text-sm">
                                            Date: {new Date(item.createdAt).toLocaleDateString() || 'No date'}
                                        </span>
                                        <h2 className="text-sm font-semibold mb-2">Student Role: {capitalizeFirstLetter(item.studentId.role)}</h2>
                                        <h2 className="text-sm font-semibold mb-2">Student Name: {item.studentId.fullName}</h2>
                                        <h2 className="text-sm font-semibold mb-2">Email: {item.studentId.emailId}</h2>
                                        <span className="mt-5">
                                            <div className="font-semibold text-sm">Assessment Title: {item.assessmentId.title}</div>
                                            <div className="font-semibold text-sm">Score: {item.score || "0"}/{item.total || 0}</div>
                                            <div className="font-semibold text-sm">Feedback: {item.feedback || 'No feedback'}</div>
                                        </span>
                                    </div>
                                )
                            ))
                        ) : (
                            <p className='text-xl'>All students haven't Pending assessments.</p>
                        )
                    ) : (
                        <p className='text-xl'>No Pending assessments found.</p>
                    )}
                </CustomTabPanel>

            </Box>
        </div>
    )
}

export default Tabsgroup

