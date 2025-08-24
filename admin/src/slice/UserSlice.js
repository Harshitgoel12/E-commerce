import { createSlice } from "@reduxjs/toolkit";


const initialState={
     Data:{},
     userData:localStorage.getItem("User")?JSON.parse(localStorage.getItem("User")):null
}

const SingupSlice= createSlice({
    name:"Signup",
    initialState,
    reducers:{
        SignupData:(state,action)=>{
            state.Data=action.payload
        },
        UserData:(state,action)=>{
            state.userData=action.payload;
        }
    }
})

export const {SignupData,UserData} =SingupSlice.actions;
export default SingupSlice.reducer