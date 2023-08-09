import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface TextInputFieldProps {
    name: string,
    label: string,
    register: UseFormRegister<any>, // can be reused by multiple
    regiserOptions?: RegisterOptions,
    error?: FieldError,
    [x: string]: any, // allows us to pass any other props that we want to this component, even if they are not defined here
}



const TextInputField = ({name, label, register, registerOptions, error, ...props}: TextInputFieldProps) => {
    return (
        <Form.Group className="mb-3" controlId={name + "-input"}>
            <Form.Label> {label} </Form.Label>
            <Form.Control
                {...props}
                {...register(name, registerOptions)}
                isInvalid={!!error} 
                />
           
            <Form.Control.Feedback type="invalid">
                 {error?.message}
            </Form.Control.Feedback>
        </Form.Group>
      );
}
 
export default TextInputField;