import FileFields from "../../../../tools/Inputs/FileFields";
import InputGroup from "../../../../tools/Inputs/InputGroup";
import TextArea from "../../../../tools/Inputs/TextArea";
import TextField from "../../../../tools/Inputs/TextField";
import { useStepperContext } from "../../Contexts/StepperContext";

export default function Details() {
    const { userData, setUserData } = useStepperContext();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    return (

        <div className='bg-[#20232A]  w-full mb-2' style={{ borderRadius: '17px' }}>
            <div className='justify-between' style={{ display: 'flex' }}>

                <TextField label='Collateral Document Name' placeholder='Enter Collateral Document Name' className='w-1/2 mr-2'></TextField>
                <FileFields label='Upload Collateral Image' className='w-1/2 ml-2'></FileFields>

            </div>
            <TextArea className='w-full' label='Document Description' placeholder='Collateral Document Description'></TextArea>
        </div>

    );
}