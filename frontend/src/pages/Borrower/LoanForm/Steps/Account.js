import TextArea from "../../../../tools/Inputs/TextArea";
import TextField from "../../../../tools/Inputs/TextField";
import { useStepperContext } from "../../Contexts/StepperContext";

export default function Account() {
    const { userData, setUserData } = useStepperContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <div style={{ display: 'flex' }} className="flex-col ">
            <div style={{ display: 'flex' }}>
                <TextField className='w-1/2 mr-2' label='Pool Name' placeholder='Enter Pool Name'></TextField>
                <TextField className='w-1/2 ml-2' label='Loan Amount' placeholder='Enter Loan Name'></TextField>
            </div>
            <div style={{ display: 'flex' }}>
                <TextField className='w-1/2 mr-2' label='Loan Tenure' placeholder='Enter Loan Tenure'></TextField>
                <TextField className='w-1/2 ml-2' label='Repayment Frequency' placeholder='Enter Repayment Frequency'></TextField>
            </div>
            <div style={{ display: 'flex' }}>
                <TextField className='w-1/2 mr-2' label='Loan Interest' placeholder='Enter Loan Interest'></TextField>
                <TextField className='w-1/2 ml-2' label='Loan Type' placeholder='Select Loan Type'></TextField>
            </div>
            <TextArea className='w-full' label='Loan Purpose' placeholder='Short Summary on Purpose of Loans'></TextArea>
        </div>
    );
}