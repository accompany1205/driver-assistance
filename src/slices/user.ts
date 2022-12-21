import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from '../utils/axios';
import { filter } from 'lodash';
import { AppThunk } from '../store';
import toast from 'react-hot-toast';
import { Id } from 'react-beautiful-dnd';
import {User} from '../types/user';

interface UserStateType {
    isLoading: boolean,
    users: User[],
    error: boolean,
    isAccountDialogOpen:boolean,
    totalCount: number,
    selectedUser: User|undefined
}
interface UsersResType {
    users: User[],
    count: number,
}
const initialState : UserStateType = {
    isLoading:false,
    users:[],
    error:false,
    isAccountDialogOpen:false,
    totalCount:0,
    selectedUser:undefined,
}

const slice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        // START LOADING
        startLoading(state:UserStateType) :void{
            state.isLoading = true;
        },
        hasError(state:UserStateType, action: PayloadAction<boolean>) :void{
            state.isLoading = false;
            state.error = action.payload;
        },
        handleADopen(state:UserStateType, action: PayloadAction<boolean>) :void{
            state.isAccountDialogOpen = action.payload;
        },
  
        // GET USERS
        getUsersSuccess(state:UserStateType, action:PayloadAction<UsersResType>):void {
            
            state.isLoading = false;
            state.users = [...action.payload.users];
            state.totalCount = action.payload.count;
            
        },

        // DELETE USERS
        deleteUser(state:UserStateType, action:PayloadAction<string[]>):void {
            const filteredList = filter(state.users, (user) => filter(action.payload,(id)=>id==user.id).length === 0);
            state.users = filteredList;
        },
        addUser(state:UserStateType, action:PayloadAction<User>):void {
            const user = action.payload;
            
            state.totalCount = state.totalCount+1;
            state.users = [...state.users, action.payload];
            
        },
        updateUser(state:UserStateType, action:PayloadAction<User>):void {
            const user = action.payload;
            state.selectedUser= {...user};
            state.users = state.users.map((data) => {
                if(data.id === user.id) {
                    return user;
                } else {
                    return data
                }
            })
        },
        updateSelectedUser(state:UserStateType, action:PayloadAction<User>):void {
            const user = action.payload;
            state.selectedUser= {...user};
        },
        updateAvatar(state:UserStateType, action:PayloadAction<{id:string,photoURL:string}>):void{
            const users = state.users;
            users.map((user)=>{if(user.id == action.payload.id)user.photoURL = action.payload.photoURL})
            state.users = users;
        },
        
    },
    
})

export const { reducer } = slice;

export default slice;

export const getUsers = (status: string, orderBy: string, filterString: string, page:Object ):AppThunk => async (dispatch):Promise<void> => {
    dispatch(slice.actions.startLoading());
    try{
        
        const response = await axios.post('/api/user/users', {
            status,
            orderBy,
            filterString,
            page,
        });
        
        dispatch(slice.actions.getUsersSuccess(response.data));
    }catch(error){
        dispatch(slice.actions.hasError(error));
    }
}

export const updateAvatar = (id: string, file: File ):AppThunk => async (dispatch):Promise<void> => {
    dispatch(slice.actions.startLoading());
    try{
        
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('/api/user/uploadAvatar',
            formData,{
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'x-id': id },
        })
        
        dispatch(slice.actions.updateAvatar(response.data));
    }catch(error){
        dispatch(slice.actions.hasError(error));
    }
}

export const deleteUser = (id: string[]):AppThunk =>async (dispatch):Promise<void> => {
    dispatch(slice.actions.startLoading());
    try{
        const response = await axios.post('/api/user/deleteUser',
            {id})
        dispatch(slice.actions.deleteUser(id));
    }catch(error){
        dispatch(slice.actions.hasError(error));
    }
}

export const addUser = (
                name:string, 
                lastName:string, 
                role: string, 
                phone: string, 
                email: string, 
                password: string,
                status: string,
                photoOriginalName: string
                ):AppThunk => async (dispatch): Promise<void> => {
    dispatch(slice.actions.startLoading());
    try{
        const response = await axios.post('/api/user/addUser',{
            name,
            lastName,
            role,
            phone,
            email,
            password,
            status,
            photoOriginalName
        });
        ;
        toast.success('User added!');
        dispatch(slice.actions.addUser(response.data));
        
        if(!response.data.id)toast.error(response.data.message);
        return response.data.id;
    }
    catch(error){
        
        
        dispatch(slice.actions.hasError(error));
    }
}

export const updateUser = (
    id:string,
    firstname:string, 
    lastname:string, 
    phone: string, 
    email: string, 
    password: string,
    status: string,
    role: string,
    file: File,
    ):AppThunk => async (dispatch): Promise<void> => {
        dispatch(slice.actions.startLoading());
        if(role==='admin')role='1';
        if(role==='Dispatcher')role='2';
        if(role==='user')role='3';
        try{
            
            const formData = new FormData();
            formData.append('id', id);
            formData.append('firstname',firstname);
            formData.append('lastname',lastname);
            formData.append('phone',phone);
            formData.append('email',email);
            formData.append('password',password);
            formData.append('status',status);
            formData.append('role',role);
            formData.append('file',file);
            const response = await axios.post('/api/user/updateProfile',
                                               formData, {
                                                headers: { 'X-Requested-With': 'XMLHttpRequest', 'x-id': id,'x-file':file?.name||'' },
                                              });
            toast.success('User updated!');
            
            dispatch(slice.actions.updateUser(response.data));
            return response.data;
        }
        catch(error){
            dispatch(slice.actions.hasError(error));
        }
}

  

