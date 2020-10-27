import { List, Datagrid, TextField } from 'react-admin';

const UsersList = (props: any) => (
    <List {...props}>
        <Datagrid>
            <TextField label="id" source="id" />
            <TextField label="Name" source="name" />
            <TextField label="E-mail" source="email" />
        </Datagrid>
    </List>
);

export default UsersList;
