import { List, Datagrid, TextField, EmailField, UrlField } from 'react-admin';
// import ListActions from './actions/ListAction';

const UsersList = (props: any) => (
    <List {...props}>
        <Datagrid rowClick="edit" contentEditable>
            <EmailField source="email" />
            <TextField source="name" />
            <TextField source="username" />
            <TextField source="website" />
            <TextField source="order" />
            <TextField source="member_id" />
            <TextField source="farm_name" />
            <UrlField source="farm_logo.src" />
            <TextField source="address" />
            <TextField source="phone" />
        </Datagrid>
    </List>
);

export default UsersList;
