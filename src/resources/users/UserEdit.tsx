import { firebaseUploadFile } from 'libs/firebaseStorage';
import { useCallback, useState } from 'react';
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
    const [farmLogo, setFarmLogo] = useState<string>();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        console.log('acceptedFiles', acceptedFiles);
        if (acceptedFiles && acceptedFiles.length > 0) {
            firebaseUploadFile({
                path: 'farm_logo',
                filename: acceptedFiles[0].name,
                file: acceptedFiles[0],
            })
                .then(setFarmLogo)
                .catch(console.warn);
        }
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
                        onDrop: onDrop,
                        onRemove: (e) => {
                            console.log('onRemove', e);
                        },
                    }}
                >
                    <ImageField source="src" title="title" />
                </ImageInput>
                <TextInput source="address" multiline validate={required()} />
            </SimpleForm>
        </Edit>
    );
};
export default UserEdit;
