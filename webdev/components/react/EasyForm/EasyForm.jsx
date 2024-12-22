import styles from './default_easy_form.module.css'

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'

/**
 * Notes:
 * Fields names must be unique, even between groups
 * "type" cannot be a name of a group or a name of a field, just a property of a field
 * Names of groups that start with '_' will not be displayed (Inner items will show as normal)
 * By default, this component uses the styles defined in the default_easy_form.module.css file
 * By default, the validation schema is generated using Yup.object, you can change this by providing a toFormikValidationSchema function
 */

/**
 * @typedef Field
 * @example
 * {
 *      label : string,
 *      type : string,
 *      placeholder : string,
 *      initial : string,
 *      validation : Yup,
 *      hidden : boolean,
 *      readOnly : boolean
 * }
 */


/**
 * Funciton that flattens an object using a condition for what is considered max depth
 */
function flatten(obj, max_depth_condition){

    return Object.entries(obj).reduce((result, [key, value]) => {
        return { 
            ...result, 
            ...(
                max_depth_condition(value)              // Check if condition to consider this object as a leaf (max depth) is met
                ? {[key] : value}                       // Return leaf
                : flatten(value, max_depth_condition)   // Recursively flatten the object (not a leaf yet)
            ) 
        };
    }, {});
}

/**
 * Function that extracts a property of each field of an object of fields (maintaining field key)
 * Basically creates a new object with the keys of each field and just the value of that property
 * @example
 * fields = { 
 *  field_name : {
 *      property1 : value1,
 *      property2 : value2
 *  },
 *  field_name_2 : {
 *      property1 : value3,
 *      property2 : value4
 *  } 
 * } 
 * result = reduce_property(fields, property2)
 * result == {
 *  field_name : value2,
 *  field_name_2 : value4
 * }
 * @param {{[name : string] : Field}} object 
 * @param {string} inner_property 
 */
function reduce_property(fields, property){

    // Use a reduce function over the keys of the object to generate a new object with the same keys and the inner property value
    return Object.keys(fields).reduce((result, key) => ({ ...result, [key] : fields[key][property] }), {});
}

/**
 * @param {{ [name : string] : Field }} fields
 * @returns 
 */
export default function EasyForm({ title, fields, handleSubmit, submit_button_text, custom_styles, toFormikValidationSchema }){    

    /* Field creation utilities */
    // Use the default styles if no custom styles are provided
    const form_styles = custom_styles ?? styles;

    // Function that returns a field or a group of fields
    function createField([key, component]){

        // Check if component is a group of fields
        if(component.type == null){

            // Create a field for each entry of the group, with the key as the group name
            return(
                <div key={key} className={form_styles['easy-form-group']}>
                    <label>{key.startsWith('_') ? '' : key}</label>
                    {Object.entries(component).map(createField)}
                </div>
            )
        }

        // Create a single field
        return(
            <div key={key} hidden={!!component.hidden} className={`${form_styles['easy-form-field']}`}>
                <label htmlFor={key}>{component.label}</label>
                <Field name={key} readOnly={!!component.readOnly} type={component.type} placeholder={component.placeholder} className="pl-2 bg-slate-100"/>
                <ErrorMessage name={key} component="div" style={{ color: 'red' }} />
            </div>
        )
    }
    
    /* Form creation */

    // "Flatten" the fields object to obtain the fields in a single level
    // This is useful to then extract the validation schema and the initial values schema
    const flat_fields = flatten(fields, (component) => component.type != null); // If field.type exists, then it is a field and not a groupt

    // Select the formik validation schema converter function
    const toFormikValidationSchemaMethod = toFormikValidationSchema ?? Yup.object; // Default to Yup.object if not provided

    return(
        <>        
            <h1 className={`${form_styles['easy-form-title']}`}>{title}</h1>
            <Formik 
                initialValues={reduce_property(flat_fields, 'initial')}
                validationSchema={toFormikValidationSchemaMethod(reduce_property(flat_fields, 'validation'))}
                onSubmit={handleSubmit}
            >
                <Form>
                    {/* Fields */}
                    {Object.entries(fields).map(createField)}

                    {/* Submit Button */}
                    <button type="submit" className={`shadow-md ${form_styles['easy-form-button']}`}>{submit_button_text}</button>
                </Form>
            </Formik>
        </>
    )
}