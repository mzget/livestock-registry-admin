import { useCallback } from 'react';
import {
    Edit,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    required,
    TopToolbar,
    ShowButton,
    ImageInput,
    ImageField,
} from 'react-admin';
import { useDropzone } from 'react-dropzone';

export const UserEdit = (props) => {
    const onDrop = useCallback((acceptedFiles) => {
        // Do something with the files
        console.log('acceptedFiles', acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <Edit {...props} title="Edit User">
            <SimpleForm>
                <TextInput disabled label="Id" source="id" />
                <TextInput source="email" validate={required()} />
                <TextInput source="username" validate={required()} />
                <TextInput source="farm_name" validate={required()} />
                <ImageInput
                    source="farm_logo"
                    accept="image/*"
                    options={{
                        inputProps: getInputProps,
                        onDrop: onDrop,
                        onRemove: (e) => {
                            console.log('onRemove', e);
                        },
                    }}
                >
                    <ImageField />
                </ImageInput>
                <TextInput source="address" multiline validate={required()} />
            </SimpleForm>
        </Edit>
    );
};
export default UserEdit;
