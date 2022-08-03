import { useFormik } from "formik";
import FileFields from "../../../../tools/Inputs/FileFields";
import InputGroup from "../../../../tools/Inputs/InputGroup";
import TextArea from "../../../../tools/Inputs/TextArea";
import TextField from "../../../../tools/Inputs/TextField";
import { CollateralDetailsValidationSchema } from "../../../LoanForm/validations/validation";

export default function Details({ handleNext, handlePrev, formData }) {
    const formik = useFormik({
        initialValues: { collateral_document_name: '', collateral_document: '', collateral_document_description: '', capital_loss: '', },
        validationSchema: CollateralDetailsValidationSchema,
        onSubmit: (values) => {
            handleNext(values, true)
        }
    })
    return (
        <div className='bg-[#20232A]  w-full mb-2' style={{ borderRadius: '17px' }}>
            <form onSubmit={formik.handleSubmit}>
                <div className='justify-between' style={{ display: 'flex' }}>
                    <TextField
                        name='collateral_document_name'
                        value={formik.values.collateral_document_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.collateral_document_name && formik.errors.collateral_document_name
                                ? formik.errors.collateral_document_name
                                : null
                        }
                        label='Collateral Document Name' placeholder='Enter Collateral Document Name' className='w-1/2 mr-2'></TextField>
                    <FileFields
                        name='collateral_document'
                        onChange={(e) => { formik.setFieldValue('collateral_document', e.target.files[0]) }}
                        onBlur={formik.handleBlur}
                        error={
                            formik.touched.collateral_document && formik.errors.collateral_document
                                ? formik.errors.collateral_document
                                : null
                        }
                        label='Upload Collateral Image' className='w-1/2 ml-2'></FileFields>
                </div>
                <TextArea
                    name='collateral_document_description'
                    value={formik.values.collateral_document_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.collateral_document_description && formik.errors.collateral_document_description
                            ? formik.errors.collateral_document_description
                            : null
                    }
                    className='w-full' label='Document Description' placeholder='Collateral Document Description'></TextArea>
                <TextField
                    name='capital_loss'
                    value={formik.values.capital_loss}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.capital_loss && formik.errors.capital_loss
                            ? formik.errors.capital_loss
                            : null
                    }
                    label='First Capital Loss' placeholder='Enter First Capital Loss (if any)' className='w-full'></TextField>
                <input onClick={handlePrev} className="btn btn-primary btn-wide" value='Back'></input>
                <input className="btn btn-primary btn-wide" type="submit" value='Next'></input>
            </form>
        </div>

    );
}